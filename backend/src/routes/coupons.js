const express = require('express');
const router = express.Router();
const { Coupon } = require('../models');

router.post('/validate', async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ message: 'Kupon tapılmadı' });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Kuponun müddəti bitib' });
  if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Kupon limiti dolub' });
  if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum sifariş məbləği: ${coupon.minOrderAmount} AZN` });
  const discount = coupon.type === 'percent' ? (orderAmount * coupon.value / 100) : coupon.value;
  res.json({ valid: true, discount, coupon });
});
module.exports = router;
