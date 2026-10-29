const { sequelize } = require('../models');

const runMigrations = async () => {
  try {
    console.log('Running pre-migration updates...');

    // تعيين قيم افتراضية للصفوف القديمة قبل إضافة القيود NOT NULL
    await sequelize.query(`
      UPDATE "users"
      SET "firstName" = 'Unknown'
      WHERE "firstName" IS NULL OR "firstName" = '';

      UPDATE "users"
      SET "lastName" = 'Unknown'
      WHERE "lastName" IS NULL OR "lastName" = '';

      UPDATE "users"
      SET "password" = 'changeme123'
      WHERE "password" IS NULL OR "password" = '';

      UPDATE "users"
      SET "email" = 'unknown@example.com'
      WHERE "email" IS NULL OR "email" = '';
    `);

    console.log('Pre-migration updates completed.');

    console.log('Running migrations...');
    // مزامنة الموديلات مع قاعدة البيانات
    await sequelize.sync({ alter: true });

    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

runMigrations();
