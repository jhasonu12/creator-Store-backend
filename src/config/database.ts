import { Sequelize } from 'sequelize';
import { config } from './environment';
import { initializeModels } from '@models/index';
import { logger } from '@common/utils/logger';

let sequelizeInstance: Sequelize;

export const getSequelizeInstance = (): Sequelize => {
  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize({
      dialect: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      logging: config.app.nodeEnv === 'development' ? (msg: string) => logger.debug(msg) : false,
      pool: {
        min: config.database.poolMin,
        max: config.database.poolMax,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  }
  return sequelizeInstance;
};

export const initializeDatabase = async (): Promise<void> => {
  try {
    const sequelize = getSequelizeInstance();

    // Initialize models and set up associations
    initializeModels(sequelize);

    // Test connection
    await sequelize.authenticate();
    logger.info('✓ Database connection established');

    // Sync models with database
    if (config.app.nodeEnv === 'development') {
      await sequelize.sync();
      logger.info('✓ Database models synchronized');
    }
  } catch (error) {
    logger.error('✗ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (sequelizeInstance) {
    await sequelizeInstance.close();
    logger.info('✓ Database connection closed');
  }
};
