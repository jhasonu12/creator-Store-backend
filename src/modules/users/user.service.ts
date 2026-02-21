import { StatusCodes } from 'http-status-codes';
import { User } from '@models/User';
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

    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const userDto = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    // Cache for 1 hour
    await cacheSet(`user:${id}`, userDto, 3600);

    return userDto;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<any> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const updated = await user.update(data);

    // Invalidate cache
    await cacheDel(`user:${id}`);

    return {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      firstName: updated.firstName,
      lastName: updated.lastName,
      avatar: updated.avatar,
      bio: updated.bio,
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
    });

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
