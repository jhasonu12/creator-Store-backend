import { getPrismaClient } from '@config/database';
import { AppError } from '@utils/errorHandler';
import { User } from '@prisma/client';

export class UserRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async create(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
      bio?: string;
    }
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findAll(skip: number, take: number): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users: users as any, total };
  }
}
