import { UserRepository } from '@repositories/user.repository';
import { CreateUserDTO, LoginDTO } from '@dto/user.dto';
import { hashPassword, comparePasswords, generateToken, generateRefreshToken } from '@utils/helpers';
import { AppError } from '@utils/errorHandler';
import { cacheSet, cacheGet, cacheDel } from '@utils/cache';

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: CreateUserDTO): Promise<any> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new AppError(409, 'Username already taken');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate tokens
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
      refreshToken,
    };
  }

  async login(data: LoginDTO): Promise<any> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await comparePasswords(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
      refreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    // Invalidate user cache if any
    await cacheDel(`user:${userId}`);
  }
}
