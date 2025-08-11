const { sequelize } = require('../models');

const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

runMigrations();
