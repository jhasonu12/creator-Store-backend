const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'creator_world',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function addPositionColumn() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Check if position column already exists
    const tableDescription = await sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name='products' AND column_name='position'`
    );

    if (tableDescription[0] && tableDescription[0].length > 0) {
      console.log('Position column already exists, skipping migration');
      await sequelize.close();
      return;
    }

    // Add position column
    await sequelize.query(`
      ALTER TABLE "products" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;
    `);
    console.log('Position column added');

    // Create index
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS products_creatorId_position_idx ON "products"("creatorId", "position");
    `);
    console.log('Index created');

    console.log('Migration completed successfully');
    await sequelize.close();
  } catch (error) {
    console.error('Error during migration:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

addPositionColumn();
