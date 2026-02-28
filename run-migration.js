const { Sequelize } = require('sequelize');
const path = require('path');
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

const migrateProductStatus = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    const migrationPath = path.join(__dirname, 'src/migrations/20260228000001-fix-product-status-type.js');
    const migration = require(migrationPath);

    console.log('Running product status type migration...\n');
    await migration.up(sequelize.getQueryInterface(), Sequelize);

    console.log('\n✓ Product status type migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:');
    console.error('Error Message:', error.message);
    console.error('Error Details:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

migrateProductStatus();
