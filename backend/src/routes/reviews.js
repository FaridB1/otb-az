const express = require('express');
const router = express.Router();
const { Review, Product } = require('../models');
const { protect } = require('../middleware/auth');

router.post('/', async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});
router.get('/product/:productId', async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true }).sort('-createdAt');
  res.json(reviews);
});
router.get('/', protect, async (req, res) => {
  const reviews = await Review.find().populate('product', 'name').sort('-createdAt').limit(50);
  res.json(reviews);
});
router.patch('/:id/approve', protect, async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  const reviews = await Review.find({ product: review.product, isApproved: true });
  const rating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(review.product, { rating: Math.round(rating * 10) / 10, reviewCount: reviews.length });
  res.json(review);
});
router.delete('/:id', protect, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Rəy silindi' });
});
module.exports = router;
