const express = require('express');
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;

    // Create product data object
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock)
    };

    // Only add image if it's provided and not empty
    if (image && image.trim()) {
      productData.image = image;
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({ 
      message: error.message,
      errors: error.errors?.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
});

// Update product (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, image, stock } = req.body;
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock)
    };

    // Only update image if it's provided and not empty
    if (image !== undefined) {
      updateData.image = image.trim() || null;
    }

    await product.update(updateData);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 