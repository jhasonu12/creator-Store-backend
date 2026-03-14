import { Sequelize } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { StorePage, PageType, PageDataSchema, FormConfig, DigitalAsset } from '@models/StorePage';
import { PageBlock, BlockType, BlockDataSchema } from '@models/PageBlock';
import { AppError } from '@common/utils/response';
import { getSequelizeInstance } from '@config/database';

export class StorePageService {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = getSequelizeInstance();
  }

  // ========== PAGES (Product Landing Pages) ==========

  async updatePage(
    pageId: string,
    data: { type?: string; productId?: string; data?: PageDataSchema; form?: FormConfig; digitalAssets?: DigitalAsset[] }
  ): Promise<StorePage> {
    const page = await StorePage.findByPk(pageId);
    if (!page) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Page not found');
    }

    if (data.type) page.type = data.type as PageType;
    if (data.productId !== undefined) page.productId = data.productId;
    if (data.data) page.data = data.data;
    if (data.form !== undefined) page.form = data.form;
    if (data.digitalAssets !== undefined) page.digitalAssets = data.digitalAssets;

    await page.save();
    return page;
  }

  // ========== PAGE BLOCKS (Reviews & FAQs) ==========

  async createBlock(pageId: string, data: { type: string; data: BlockDataSchema; position?: number }): Promise<PageBlock> {
    const page = await StorePage.findByPk(pageId);
    if (!page) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Page not found');
    }

    // Get max position
    const lastBlock = await PageBlock.findOne({
      where: { pageId },
      order: [['position', 'DESC']],
    });

    const position = data.position ?? (lastBlock ? lastBlock.position + 1 : 0);

    const block = await PageBlock.create({
      pageId,
      type: data.type as BlockType,
      data: data.data as BlockDataSchema,
      position,
    });

    return block;
  }

  async updateBlock(blockId: string, data: { type?: string; data?: BlockDataSchema }): Promise<PageBlock> {
    const block = await PageBlock.findByPk(blockId);
    if (!block) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Block not found');
    }

    if (data.type) block.type = data.type as BlockType;
    if (data.data) block.data = data.data as BlockDataSchema;

    await block.save();
    return block;
  }

  async deleteBlock(blockId: string): Promise<void> {
    const block = await PageBlock.findByPk(blockId);
    if (!block) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Block not found');
    }

    await block.destroy();
  }

  async reorderBlocks(pageId: string, blocks: Array<{ id: string; position: number }>): Promise<PageBlock[]> {
    const page = await StorePage.findByPk(pageId);
    if (!page) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Page not found');
    }

    const transaction = await this.sequelize.transaction();

    try {
      const updatedBlocks = await Promise.all(
        blocks.map(async (item) => {
          const block = await PageBlock.findByPk(item.id, { transaction });
          if (!block || block.pageId !== pageId) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Block not found');
          }
          block.position = item.position;
          await block.save({ transaction });
          return block;
        })
      );

      await transaction.commit();
      return updatedBlocks;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getBlocks(pageId: string): Promise<PageBlock[]> {
    return PageBlock.findAll({
      where: { pageId },
      order: [['position', 'ASC']],
    });
  }

}
