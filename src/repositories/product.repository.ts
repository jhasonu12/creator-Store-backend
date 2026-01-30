import { getPrismaClient } from '@config/database';
import { Product } from '@prisma/client';

export class ProductRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findBySlug(creatorId: string, slug: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        creatorId_slug: {
          creatorId,
          slug,
        },
      },
    });
  }

  async create(creatorId: string, data: any): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...data,
        creatorId,
      },
    });
  }

  async update(id: string, data: any): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findByCreatorId(creatorId: string, skip: number, take: number): Promise<any> {
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { creatorId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { displayName: true } } },
      }),
      this.prisma.product.count({
        where: { creatorId },
      }),
    ]);

    return { products, total };
  }

  async findPublished(skip: number, take: number, filters?: any): Promise<any> {
    const where: any = { status: 'published' };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [{ title: { contains: filters.search, mode: 'insensitive' } }];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { displayName: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total };
  }
}
