import { Sequelize } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { Store, StoreType } from '@models/Store';
import { StoreSection, SectionStatus, SectionType } from '@models/StoreSection';
import { StorePage, PageStatus, PageType, PageDataSchema, FormConfig, DigitalAsset } from '@models/StorePage';
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
    data: { type: string; productId?: string; data: PageDataSchema; form?: FormConfig; digitalAssets?: DigitalAsset[] }
  ): Promise<StorePage> {
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Store not found');
    }

    const page = await StorePage.create({
      storeId,
      type: data.type as PageType,
      productId: data.productId,
      data: data.data,
      ...(data.form !== undefined && { form: data.form }),
      ...(data.digitalAssets !== undefined && { digitalAssets: data.digitalAssets }),
      status: PageStatus.DRAFT,
    });

    return page;
  }

  async getPages(storeId: string): Promise<StorePage[]> {
    return StorePage.findAll({
      where: { storeId },
      order: [['createdAt', 'DESC']],
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
        name: 'minima',
        config,
      });
    } else {
      theme.config = config;
      await theme.save();
    }

    return theme;
  }
}
