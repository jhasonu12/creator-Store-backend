import { Sequelize } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import { User, UserRole } from '@models/User';
import { RefreshToken } from '@models/RefreshToken';
import { CreatorProfile } from '@models/CreatorProfile';
import { StoreSlug, StoreSlugStatus } from '@models/StoreSlug';
import { LoginDTO } from '@dto/user.dto';
import {
  hashPassword,
  comparePasswords,
  generateToken,
  generateRefreshToken,
  hashToken,
} from '@common/utils/helpers';
import { AppError } from '@common/utils/response';
import { cacheDel } from '@common/utils/cache';
import { getSequelizeInstance } from '@config/database';
import { AnalyticsService } from '@modules/analytics';

export class AuthService {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = getSequelizeInstance();
  }

  /**
   * Basic user signup
   * Creates a new user with USER role
   */
  async signup(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<{
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if email/username already exists
    const existingUser = await User.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists');
    }

    const existingUsername = await User.findOne({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new AppError(409, 'Username already taken');
    }

    // Create user with USER role
    const hashedPassword = await hashPassword(data.password);
    const user = await User.create({
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: UserRole.USER,
      isEmailVerified: false,
      isVerified: false,
    });

    // Generate tokens
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const refreshTokenStr = generateRefreshToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Create refresh token record
    const tokenHash = await hashToken(refreshTokenStr);
    await RefreshToken.create({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      revoked: false,
    });

    // Log analytics event
    AnalyticsService.trackEvent('USER_REGISTERED', {
      userId: user.id,
      metadata: {
        role: 'USER',
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken: refreshTokenStr,
    };
  }

  /**
   * Signup with creator registration
   * Atomic transaction: StoreSlug (RESERVED) → User → CreatorProfile → RefreshToken → Activate StoreSlug
   */
  async signupAsCreator(data: {
    email: string;
    username: string;
    password: string;
    slug: string;
    fullName: string;
    timezone?: string;
    countryCode?: string;
  }): Promise<{
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
      creatorProfile?: {
        fullName: string;
        timezone: string;
      };
      storeSlug?: string;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    const transaction = await this.sequelize.transaction();

    try {
      // 1. Check if email/username already exists
      const existingUser = await User.findOne({
        where: { email: data.email },
        transaction,
      });
      if (existingUser) {
        throw new AppError(409, 'User with this email already exists');
      }

      const existingUsername = await User.findOne({
        where: { username: data.username },
        transaction,
      });
      if (existingUsername) {
        throw new AppError(409, 'Username already taken');
      }

      // 2. Reserve store slug
      const existingSlug = await StoreSlug.findOne({
        where: { slug: data.slug },
        transaction,
      });
      if (existingSlug) {
        throw new AppError(409, 'Slug already taken');
      }

      const storeSlug = await StoreSlug.create(
        {
          slug: data.slug,
          status: StoreSlugStatus.RESERVED,
          reservedAt: new Date(),
        },
        { transaction }
      );

      // 3. Create user with CREATOR role
      const hashedPassword = await hashPassword(data.password);
      const user = await User.create(
        {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          role: UserRole.CREATOR,
          isEmailVerified: false,
          isVerified: false,
        },
        { transaction }
      );

      // 4. Create creator profile
      const creatorProfile = await CreatorProfile.create(
        {
          userId: user.id,
          fullName: data.fullName,
          timezone: data.timezone || 'UTC',
          countryCode: data.countryCode || null,
          onboardingCompleted: false,
        },
        { transaction }
      );

      // 5. Activate store slug
      storeSlug.creatorId = user.id;
      storeSlug.status = StoreSlugStatus.ACTIVE;
      storeSlug.activatedAt = new Date();
      await storeSlug.save({ transaction });

      // 6. Generate tokens
      const accessToken = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      const refreshTokenStr = generateRefreshToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      // 7. Create refresh token record
      const tokenHash = await hashToken(refreshTokenStr);
      await RefreshToken.create(
        {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          revoked: false,
        },
        { transaction }
      );

      // 8. Log analytics event
      AnalyticsService.trackEvent('CREATOR_REGISTERED', {
        userId: user.id,
        creatorId: user.id,
        metadata: {
          slug: data.slug,
          fullName: data.fullName,
        },
      });

      // Commit transaction
      await transaction.commit();

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          creatorProfile: {
            fullName: creatorProfile.fullName,
            timezone: creatorProfile.timezone,
          },
          storeSlug: storeSlug.slug,
        },
        accessToken,
        refreshToken: refreshTokenStr,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(data: LoginDTO): Promise<{
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await comparePasswords(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const refreshTokenStr = generateRefreshToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Create refresh token record
    const tokenHash = await hashToken(refreshTokenStr);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      revoked: false,
    });

    // Log analytics event
    AnalyticsService.trackEvent('LOGIN_SUCCESS', {
      userId: user.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken: refreshTokenStr,
    };
  }

  /**
   * Refresh token rotation
   * Validates refresh token, invalidates old one, creates new one
   */
  async refreshToken(refreshTokenStr: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Decode and verify token (using JWT library)
      const decoded = jwt.verify(
        refreshTokenStr,
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret'
      ) as { id: string };

      if (!decoded || !decoded.id) {
        throw new AppError(401, 'Invalid refresh token');
      }

      // Find the refresh token record
      const tokenHash = await hashToken(refreshTokenStr);
      const refreshTokenRecord = await RefreshToken.findOne({
        where: {
          userId: decoded.id,
          tokenHash,
          revoked: false,
        },
      });

      if (!refreshTokenRecord) {
        throw new AppError(401, 'Refresh token not found or revoked');
      }

      if (new Date() > refreshTokenRecord.expiresAt) {
        throw new AppError(401, 'Refresh token expired');
      }

      // Get user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new AppError(401, 'User not found');
      }

      // Revoke old token
      refreshTokenRecord.revoked = true;
      await refreshTokenRecord.save();

      // Generate new tokens
      const newAccessToken = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      const newRefreshTokenStr = generateRefreshToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      // Create new refresh token record
      const newTokenHash = await hashToken(newRefreshTokenStr);
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await RefreshToken.create({
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt: newExpiresAt,
        revoked: false,
      });

      // Log analytics event
      AnalyticsService.trackEvent('TOKEN_REFRESHED', {
        userId: user.id,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshTokenStr,
      };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(401, 'Invalid refresh token');
    }
  }

  /**
   * Logout user
   * Revokes all refresh tokens
   */
  async logout(userId: string): Promise<void> {
    // Revoke all active refresh tokens
    await RefreshToken.update(
      { revoked: true },
      {
        where: {
          userId,
          revoked: false,
        },
      }
    );

    // Clear cache
    await cacheDel(`user:${userId}`);

    // Log analytics event
    AnalyticsService.trackEvent('LOGOUT', {
      userId,
    });
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(userId: string): Promise<User> {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'username', 'role', 'isEmailVerified', 'isVerified', 'createdAt'],
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }
}

