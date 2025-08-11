const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Product } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const { uploadToS3 } = require('../services/s3Service');

const router = express.Router();

// Get all products with search and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('category').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let whereClause = {};
    
    if (search) {
      whereClause.name = { [require('sequelize').Op.iLike]: `%${search}%` };
    }
    
    if (category) {
      whereClause.category = category;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', adminAuth, [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('category').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock, category } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, [
  body('name').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
