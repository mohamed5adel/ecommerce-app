const bcrypt = require('bcryptjs');
const { User, Product } = require('../models');

const seedData = async () => {
  try {
    console.log('Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true
    });
    console.log('Admin user created:', adminUser.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const regularUser = await User.create({
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      isAdmin: false
    });
    console.log('Regular user created:', regularUser.email);

    // Create sample products
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and long battery life.',
        price: 99.99,
        stock: 50,
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/300x300?text=Headphones'
      },
      {
        name: 'Smartphone Case',
        description: 'Durable protective case for smartphones with shock absorption.',
        price: 19.99,
        stock: 100,
        category: 'Accessories',
        imageUrl: 'https://via.placeholder.com/300x300?text=Phone+Case'
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable laptop stand for better ergonomics and cooling.',
        price: 29.99,
        stock: 75,
        category: 'Accessories',
        imageUrl: 'https://via.placeholder.com/300x300?text=Laptop+Stand'
      },
      {
        name: 'USB-C Cable',
        description: 'Fast charging USB-C cable with data transfer capabilities.',
        price: 12.99,
        stock: 200,
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/300x300?text=USB+Cable'
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking.',
        price: 24.99,
        stock: 60,
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/300x300?text=Wireless+Mouse'
      }
    ];

    for (const productData of products) {
      await Product.create(productData);
    }
    console.log(`${products.length} products created`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
