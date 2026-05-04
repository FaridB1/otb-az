const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { protect } = require('../middleware/auth');

// GET /api/products
router.get('/', async (req, res) => {
  const {
    page = 1, limit = 12, category, unit, brand,
    minPrice, maxPrice, search, isFeatured, isNew,
    isBestSeller, isFlashSale, sort = '-createdAt'
  } = req.query;

  const query = { isAvailable: true };
  if (category) query.category = category;
  if (unit) query.unit = unit;
  if (brand) query.brand = new RegExp(brand, 'i');
  if (isFeatured === 'true') query.isFeatured = true;
  if (isNew === 'true') query.isNewProduct = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (isFlashSale === 'true') { query.isFlashSale = true; query.flashSaleEnd = { $gt: new Date() }; }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  let sortOption = '-createdAt';
  if (sort === 'price_asc') sortOption = 'price';
  else if (sort === 'price_desc') sortOption = '-price';
  else if (sort === 'popular') sortOption = '-soldCount';
  else if (sort === 'discount') sortOption = '-discountPercent';
  else if (sort === 'newest') sortOption = '-createdAt';
  else sortOption = sort;

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(query).populate('category', 'name nameAz slug icon').sort(sortOption).skip(skip).limit(Number(limit)),
    Product.countDocuments(query)
  ]);
  res.json({ products, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
});

// GET /api/products/search
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const products = await Product.find({ $text: { $search: q }, isAvailable: true }).populate('category', 'name nameAz slug').limit(10);
  res.json(products);
});

// GET /api/products/slug/:slug
router.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name nameAz slug icon');
  if (!product) return res.status(404).json({ message: 'Məhsul tapılmadı' });
  res.json(product);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name nameAz slug icon');
  if (!product) return res.status(404).json({ message: 'Məhsul tapılmadı' });
  res.json(product);
});

// POST /api/products (admin)
router.post('/', protect, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Məhsul tapılmadı' });
  res.json(product);
});

// PATCH /api/products/:id/stock (admin)
router.patch('/:id/stock', protect, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { stock: req.body.stock }, { new: true });
  res.json(product);
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Məhsul silindi' });
});

module.exports = router;
