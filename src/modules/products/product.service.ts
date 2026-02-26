import { StatusCodes } from 'http-status-codes';
import { Sequelize } from 'sequelize';
import { Product, ProductType, ProductStatus } from '@models/Product';
import { CreatorProfile } from '@models/CreatorProfile';
import { AppError } from '@common/utils/response';
import { getSequelizeInstance } from '@config/database';

export class ProductService {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = getSequelizeInstance();
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
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get a single product
   */
  async getProduct(productId: string): Promise<Product> {
    const product = await Product.findByPk(productId);
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
      description: string;
      price: number;
      currency?: string;
      thumbnailUrl?: string;
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

    // Create product
    const product = await Product.create({
      creatorId: creator.id,
      type: data.type,
      title: data.title,
      description: data.description,
      price: data.price,
      currency: data.currency || 'USD',
      thumbnailUrl: data.thumbnailUrl || null,
      status: ProductStatus.DRAFT,
      position: nextPosition,
    });

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
      description?: string;
      price?: number;
      currency?: string;
      thumbnailUrl?: string;
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
    if (data.description) product.description = data.description;
    if (data.price !== undefined) product.price = data.price;
    if (data.currency) product.currency = data.currency;
    if (data.thumbnailUrl !== undefined) product.thumbnailUrl = data.thumbnailUrl;
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
