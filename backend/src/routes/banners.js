const express = require('express');
const router = express.Router();
const { Banner } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { type } = req.query;
  const query = { isActive: true };
  if (type) query.type = type;
  const banners = await Banner.find(query).sort('order');
  res.json(banners);
});
router.post('/', protect, async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});
router.put('/:id', protect, async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(banner);
});
router.delete('/:id', protect, async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: 'Banner silindi' });
});
module.exports = router;
