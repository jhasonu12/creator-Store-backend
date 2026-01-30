import { UserRepository } from '@repositories/user.repository';
import { UpdateUserDTO } from '@dto/user.dto';
import { AppError } from '@utils/errorHandler';
import { cacheGet, cacheSet, cacheDel } from '@utils/cache';

export class UserService {
  private userRepository = new UserRepository();

  async getUserById(id: string): Promise<any> {
    // Try to get from cache first
    const cachedUser = await cacheGet(`user:${id}`);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
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
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const updated = await this.userRepository.update(id, data);

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
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await this.userRepository.delete(id);
    await cacheDel(`user:${id}`);
  }

  async getAllUsers(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit;
    const { users, total } = await this.userRepository.findAll(skip, limit);

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
