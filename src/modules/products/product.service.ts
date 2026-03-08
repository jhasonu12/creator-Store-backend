import { StatusCodes } from 'http-status-codes';
import { Sequelize, Op } from 'sequelize';
import { Product, ProductType, ProductStatus, StyleType } from '@models/Product';
import { CreatorProfile } from '@models/CreatorProfile';
import { Store } from '@models/Store';
import { StorePage, PageStatus, PageType, PageDataSchema } from '@models/StorePage';
import { PageBlock } from '@models/PageBlock';
import { AppError } from '@common/utils/response';
import { getSequelizeInstance } from '@config/database';

export class ProductService {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = getSequelizeInstance();
  }

  /**
   * Generate a unique slug from title for a creator
   */
  private async generateUniqueSlug(title: string, creatorId: string, excludeProductId?: string): Promise<string> {
    // Convert title to slug format (lowercase, replace spaces with hyphens)
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^\-|\-$/g, '');

    // Check if slug exists for this creator
    const query: any = { creatorId, slug };
    if (excludeProductId) {
      query.id = { [Op.ne]: excludeProductId };
    }

    let existingProduct = await Product.findOne({ where: query });
    let suffix = 1;

    // If slug exists, append incremental number
    while (existingProduct) {
      slug = `${title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]/g, '')
        .replace(/\-+/g, '-')
        .replace(/^\-|\-$/g, '')}-${suffix}`;

      existingProduct = await Product.findOne({
        where: {
          creatorId,
          slug,
          ...(excludeProductId && { id: { [Op.ne]: excludeProductId } }),
        },
      });
      suffix++;
    }

    return slug;
  }

  /**
   * Get all products for a creator
   */
  async getProducts(userId: string): Promise<Product[]> {
    // Get creator profile
    const creator = await CreatorProfile.findOne({ where: { userId } });
    if (!creator) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Creator profile not found. Please use the creator-signup endpoint to create a creator account.'
      );
    }

    return Product.findAll({
      where: { creatorId: creator.id },
      attributes: ['id', 'type', 'title', 'subtitle', 'thumbnailUrl', 'displayStyle', 'ctaButtonText', 'status', 'position', 'createdAt', 'updatedAt'],
      order: [['position', 'ASC']],
      include: [
        {
          model: StorePage,
          as: 'pages',
          attributes: ['id', 'type', 'status', 'data', 'createdAt', 'updatedAt'],
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: PageBlock,
              as: 'blocks',
              attributes: ['id', 'type', 'position', 'data', 'createdAt', 'updatedAt'],
              order: [['position', 'ASC']],
            },
          ],
        },
      ],
    });
  }

  /**
   * Get a single product
   */
  async getProduct(productId: string): Promise<Product> {
    const product = await Product.findByPk(productId, {
      attributes: ['id', 'type', 'title', 'subtitle', 'thumbnailUrl', 'displayStyle', 'ctaButtonText', 'status', 'position', 'createdAt', 'updatedAt'],
      include: [
        {
          model: StorePage,
          as: 'pages',
          attributes: ['id', 'type', 'status', 'data', 'createdAt', 'updatedAt'],
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: PageBlock,
              as: 'blocks',
              attributes: ['id', 'type', 'position', 'data', 'createdAt', 'updatedAt'],
              order: [['position', 'ASC']],
            },
          ],
        },
      ],
    });
    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    }
    return product;
  }

  /**
   * Create a new product
   */
  async createProduct(
    userId: string,
    data: {
      type: ProductType;
      title: string;
      subtitle?: string | null;
      thumbnailUrl?: string | null;
      displayStyle?: string;
      ctaButtonText?: string;
    }
  ): Promise<Product> {
    // Verify creator profile exists
    const creator = await CreatorProfile.findOne({ where: { userId } });
    
    if (!creator) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Creator profile not found. Please use the creator-signup endpoint to create a creator account, or contact support.'
      );
    }

    // Get the next position for this creator
    const maxPositionProduct = await Product.findOne({
      where: { creatorId: creator.id },
      order: [['position', 'DESC']],
    });
    const nextPosition = (maxPositionProduct?.position ?? -1) + 1;

    // Generate unique slug from title
    const slug = await this.generateUniqueSlug(data.title, creator.id);

    // Create product
    const product = await Product.create({
      creatorId: creator.id,
      type: data.type,
      title: data.title,
      subtitle: data.subtitle || null,
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1505228395891-9a51e7e86b52?w=400&h=300&fit=crop&crop=entropy&cs=tinysrgb&q=60&ixlib=rb-4.0.3',
      slug,
      displayStyle: data.displayStyle || 'Button',
      ctaButtonText: data.ctaButtonText || 'Get Access',
      status: ProductStatus.DRAFT,
      position: nextPosition,
    });

    // Get the creator's store
    const store = await Store.findOne({ where: { creatorId: creator.id } });
    if (store) {
      // Create a default checkout page for this product with pricing data
      const pageData: PageDataSchema = {
        title: `${product.title} - Checkout`,
        productId: product.id,
        price: 0,
        currency: 'USD',
        discountPrice: null,
        isDiscountPriceAvailable: false,
      };

      await StorePage.create({
        storeId: store.id,
        productId: product.id,
        type: PageType.CHECKOUT,
        status: PageStatus.DRAFT,
        data: pageData,
      });
    }

    return product;
  }

  /**
   * Update a product
   */
  async updateProduct(
    productId: string,
    userId: string,
    data: {
      type?: ProductType;
      title?: string;
      subtitle?: string | null;
      thumbnailUrl?: string | null;
      displayStyle?: StyleType;
      ctaButtonText?: string;
      status?: ProductStatus;
    }
  ): Promise<Product> {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // Verify ownership
    const creator = await CreatorProfile.findOne({ where: { userId } });
    if (!creator || product.creatorId !== creator.id) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to update this product'
      );
    }

    // Update fields
    if (data.type) product.type = data.type;
    if (data.title) product.title = data.title;
    if (data.subtitle !== undefined) product.subtitle = data.subtitle;
    if (data.thumbnailUrl !== undefined) product.thumbnailUrl = data.thumbnailUrl;
    if (data.displayStyle) product.displayStyle = data.displayStyle;
    if (data.ctaButtonText) product.ctaButtonText = data.ctaButtonText;
    if (data.status) product.status = data.status;

    await product.save();
    return product;
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string, userId: string): Promise<void> {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // Verify ownership
    const creator = await CreatorProfile.findOne({ where: { userId } });
    if (!creator || product.creatorId !== creator.id) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to delete this product'
      );
    }

    await product.destroy();
  }

  /**
   * Update product status
   */
  async updateStatus(productId: string, userId: string, status: ProductStatus): Promise<Product> {
    // Validate status is a valid value
    if (!Object.values(ProductStatus).includes(status)) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Invalid status. Allowed values: ${Object.values(ProductStatus).join(', ')}`
      );
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    // Verify ownership
    const creator = await CreatorProfile.findOne({ where: { userId } });
    if (!creator || product.creatorId !== creator.id) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to update this product'
      );
    }

    product.status = status;
    await product.save();
    return product;
  }

  /**
   * Reorder products for a creator (atomic transaction)
   */
  async reorderProducts(
    userId: string,
    products: Array<{ id: string; position: number }>
  ): Promise<Product[]> {
    // Verify creator profile exists
    const creator = await CreatorProfile.findOne({ where: { userId } });
    if (!creator) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Creator profile not found. Please use the creator-signup endpoint to create a creator account.'
      );
    }

    // Perform reorder in a transaction for atomicity
    const updatedProducts = await this.sequelize.transaction(
      async (transaction) => {
        const results: Product[] = [];

        for (const item of products) {
          const product = await Product.findByPk(item.id, { transaction });
          if (!product) {
            throw new AppError(StatusCodes.NOT_FOUND, `Product ${item.id} not found`);
          }

          // Verify ownership
          if (product.creatorId !== creator.id) {
            throw new AppError(
              StatusCodes.FORBIDDEN,
              `You do not have permission to update product ${item.id}`
            );
          }

          product.position = item.position;
          await product.save({ transaction });
          results.push(product);
        }

        return results;
      }
    );

    return updatedProducts;
  }
}
