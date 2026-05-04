const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort('order');
  res.json(cats);
});
router.post('/', protect, async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(cat);
});
router.put('/:id', protect, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
});
router.delete('/:id', protect, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Kateqoriya silindi' });
});
module.exports = router;
