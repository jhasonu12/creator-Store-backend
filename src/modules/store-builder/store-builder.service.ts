import { Sequelize } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { Store, StoreType, StoreStatus } from '@models/Store';
import { StoreSection, SectionStatus, SectionType } from '@models/StoreSection';
import { StorePage, PageStatus, PageType } from '@models/StorePage';
import { PageBlock, BlockType } from '@models/PageBlock';
import { StoreTheme } from '@models/StoreTheme';
import { AppError } from '@common/utils/response';
import { getSequelizeInstance } from '@config/database';

export class StoreBuilderService {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = getSequelizeInstance();
  }

  // ========== STORE ==========

  async getStore(creatorProfileId: string): Promise<Store> {
    const store = await Store.findOne({ where: { creatorId: creatorProfileId } });

    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found. Store is created during creator signup.');
    }

    return store;
  }

  async updateStore(storeId: string, data: { name?: string; description?: string; type?: StoreType }): Promise<Store> {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
    }

    if (data.name) store.name = data.name;
    if (data.description) store.description = data.description;
    if (data.type) store.type = data.type;

    await store.save();
    return store;
  }

  // ========== SECTIONS (Link-in-bio) ==========

  async createSection(storeId: string, data: { type: string; data: Record<string, unknown>; position?: number }): Promise<StoreSection> {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
    }

    // Get max position
    const lastSection = await StoreSection.findOne({
      where: { storeId },
      order: [['position', 'DESC']],
    });

    const position = data.position ?? (lastSection ? lastSection.position + 1 : 0);

    const section = await StoreSection.create({
      storeId,
      type: data.type as SectionType,
      data: data.data,
      position,
      status: SectionStatus.PUBLISHED,
    });

    return section;
  }

  async updateSection(
    sectionId: string,
    data: { type?: string; data?: Record<string, unknown> }
  ): Promise<StoreSection> {
    const section = await StoreSection.findByPk(sectionId);
    if (!section) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Section not found');
    }

    if (data.type) section.type = data.type as SectionType;
    if (data.data) section.data = data.data;

    await section.save();
    return section;
  }

  async deleteSection(sectionId: string): Promise<void> {
    const section = await StoreSection.findByPk(sectionId);
    if (!section) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Section not found');
    }

    await section.destroy();
  }

  async reorderSections(
    storeId: string,
    sections: Array<{ id: string; position: number }>
  ): Promise<StoreSection[]> {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
    }

    const transaction = await this.sequelize.transaction();

    try {
      const updatedSections = await Promise.all(
        sections.map(async (item) => {
          const section = await StoreSection.findByPk(item.id, { transaction });
          if (!section || section.storeId !== storeId) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Section not found');
          }
          section.position = item.position;
          await section.save({ transaction });
          return section;
        })
      );

      await transaction.commit();
      return updatedSections;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getSections(storeId: string): Promise<StoreSection[]> {
    return StoreSection.findAll({
      where: { storeId },
      order: [['position', 'ASC']],
    });
  }

  // ========== PAGES (Product Landing Pages) ==========

  async createPage(
    storeId: string,
    data: { slug: string; type: string; productId?: string; data?: Record<string, unknown>; position?: number }
  ): Promise<StorePage> {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
    }

    // Check slug uniqueness
    const existingPage = await StorePage.findOne({ where: { slug: data.slug } });
    if (existingPage) {
      throw new AppError(StatusCodes.CONFLICT, 'Slug already exists');
    }

    // Get max position
    const lastPage = await StorePage.findOne({
      where: { storeId },
      order: [['position', 'DESC']],
    });

    const position = data.position ?? (lastPage ? lastPage.position + 1 : 0);

    const page = await StorePage.create({
      storeId,
      slug: data.slug,
      type: data.type as PageType,
      productId: data.productId,
      data: data.data || {},
      position,
      status: PageStatus.DRAFT,
    });

    return page;
  }

  async updatePage(
    pageId: string,
    data: { slug?: string; type?: string; productId?: string; data?: Record<string, unknown> }
  ): Promise<StorePage> {
    const page = await StorePage.findByPk(pageId);
    if (!page) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Page not found');
    }

    if (data.slug && data.slug !== page.slug) {
      const existingPage = await StorePage.findOne({ where: { slug: data.slug } });
      if (existingPage) {
        throw new AppError(StatusCodes.CONFLICT, 'Slug already exists');
      }
      page.slug = data.slug;
    }

    if (data.type) page.type = data.type as PageType;
    if (data.productId !== undefined) page.productId = data.productId;
    if (data.data) page.data = data.data;

    await page.save();
    return page;
  }

  async deletePage(pageId: string): Promise<void> {
    const page = await StorePage.findByPk(pageId);
    if (!page) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Page not found');
    }

    await page.destroy();
  }

  async reorderPages(storeId: string, pages: Array<{ id: string; position: number }>): Promise<StorePage[]> {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
    }

    const transaction = await this.sequelize.transaction();

    try {
      const updatedPages = await Promise.all(
        pages.map(async (item) => {
          const page = await StorePage.findByPk(item.id, { transaction });
          if (!page || page.storeId !== storeId) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Page not found');
          }
          page.position = item.position;
          await page.save({ transaction });
          return page;
        })
      );

      await transaction.commit();
      return updatedPages;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPages(storeId: string): Promise<StorePage[]> {
    return StorePage.findAll({
      where: { storeId },
      order: [['position', 'ASC']],
    });
  }

  // ========== PAGE BLOCKS (Sales Builder) ==========

  async createBlock(pageId: string, data: { type: string; data: Record<string, unknown>; position?: number }): Promise<PageBlock> {
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
      data: data.data,
      position,
    });

    return block;
  }

  async updateBlock(blockId: string, data: { type?: string; data?: Record<string, unknown> }): Promise<PageBlock> {
    const block = await PageBlock.findByPk(blockId);
    if (!block) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Block not found');
    }

    if (data.type) block.type = data.type as BlockType;
    if (data.data) block.data = data.data;

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

  // ========== THEME ==========

  async getTheme(storeId: string): Promise<StoreTheme> {
    const theme = await StoreTheme.findOne({ where: { storeId } });

    if (!theme) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Theme not found for this store');
    }

    return theme;
  }

  async updateTheme(storeId: string, config: Record<string, unknown>): Promise<StoreTheme> {
    let theme = await StoreTheme.findOne({ where: { storeId } });

    if (!theme) {
      theme = await StoreTheme.create({
        storeId,
        config,
      });
    } else {
      theme.config = config;
      await theme.save();
    }

    return theme;
  }
}
