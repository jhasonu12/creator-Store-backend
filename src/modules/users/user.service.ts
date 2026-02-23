import { StatusCodes } from 'http-status-codes';
import { User } from '@models/User';
import { CreatorProfile } from '@models/CreatorProfile';
import { UpdateUserDTO } from '@dto/user.dto';
import { AppError } from '@common/utils/response';
import { cacheGet, cacheSet, cacheDel } from '@common/utils/cache';

export class UserService {

  async getUserById(id: string): Promise<any> {
    // Try to get from cache first
    const cachedUser = await cacheGet(`user:${id}`);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'username'],
      include: [
        {
          model: CreatorProfile,
          attributes: ['fullName', 'profileImage', 'bio', 'socials'],
          required: false,
        },
      ],
    });
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }
    // Cache for 1 hour
    await cacheSet(`user:${id}`, user, 3600);

    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<any> {
    // Verify user exists
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'username'],
    });
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Work directly with CreatorProfile using userId
    if (data.creatorProfile) {
      const creatorProfile = await CreatorProfile.findOne({
        where: { userId: id },
      });
      
      // Create CreatorProfile if it doesn't exist
      if (!creatorProfile) {
        await CreatorProfile.create({
          userId: id,
          ...data.creatorProfile,
        });
      } else {
        // Update existing CreatorProfile
        await creatorProfile.update({
          ...data.creatorProfile,
          socials: data.creatorProfile.socials ? {
            ...creatorProfile.socials,
            ...data.creatorProfile.socials,
          } : creatorProfile.socials,
        });
      }
    }

    // Invalidate cache
    await cacheDel(`user:${id}`);

    // Fetch updated CreatorProfile
    const updatedCreatorProfile = await CreatorProfile.findOne({
      where: { userId: id },
      attributes: ['fullName', 'profileImage', 'bio', 'socials'],
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      ...(updatedCreatorProfile && {
        creatorProfile: updatedCreatorProfile.toJSON(),
      }),
    };
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    await user.destroy();
    await cacheDel(`user:${id}`);
  }

  async getAllUsers(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;
    const { rows: users, count: total } = await User.findAndCountAll({
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']],
      attributes: ['email', 'username'],
      include: [
        {
          model: CreatorProfile,
          attributes: ['fullName', 'profileImage', 'bio', 'socials'],
          required: false,
        },
      ],
    });

    return {
      users: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
