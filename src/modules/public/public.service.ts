import { StatusCodes } from 'http-status-codes';
import { Store, StoreStatus } from '@models/Store';
import { CreatorProfile } from '@models/CreatorProfile';
import { Product, ProductStatus } from '@models/Product';
import { StoreSection, SectionStatus } from '@models/StoreSection';
import { StorePage, PageStatus } from '@models/StorePage';
import { PageBlock } from '@models/PageBlock';
import { StoreTheme } from '@models/StoreTheme';
import { AppError } from '@common/utils/response';

export class PublicService {
  async getStoreBySlug(slug: string): Promise<any> {
    // 1. Find the store (must be ACTIVE)
    const store = await Store.findOne({
      where: { slug, status: StoreStatus.ACTIVE },
      include: [
        {
          model: CreatorProfile,
          as: 'creatorProfile',
          attributes: ['id', 'fullName', 'profileImage', 'bio', 'socials'],
        },
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'type', 'title', 'description', 'price', 'currency', 'thumbnailUrl', 'status', 'position', 'createdAt', 'updatedAt'],
          order: [['position', 'ASC']],
          where: { status: ProductStatus.PUBLISHED },
          required: false,
        },
        {
          model: StoreSection,
          as: 'sections',
          attributes: ['id', 'type', 'position', 'status', 'data', 'createdAt', 'updatedAt'],
          order: [['position', 'ASC']],
          where: { status: SectionStatus.PUBLISHED },
          required: false,
        },
        {
          model: StorePage,
          as: 'pages',
          attributes: ['id', 'slug', 'type', 'position', 'status', 'data', 'createdAt', 'updatedAt'],
          order: [['position', 'ASC']],
          where: { status: PageStatus.PUBLISHED },
          required: false,
          include: [
            {
              model: PageBlock,
              as: 'blocks',
              attributes: ['id', 'type', 'position', 'data', 'createdAt', 'updatedAt'],
              order: [['position', 'ASC']],
            },
          ],
        },
        {
          model: StoreTheme,
          as: 'theme',
          attributes: ['id', 'config', 'updatedAt'],
        },
      ],
    });

    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found or is not active');
    }

    return store.toJSON();
  }
}
