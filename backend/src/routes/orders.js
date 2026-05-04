const express = require('express');
const router = express.Router();
const { Order, Product, Coupon } = require('../models');
const { protect } = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { customer, items, couponCode } = req.body;
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isAvailable) return res.status(400).json({ message: `${item.name} mövcud deyil` });
    if (product.stock < item.quantity) return res.status(400).json({ message: `${product.name} stokda yoxdur` });
    subtotal += product.price * item.quantity;
    orderItems.push({ product: product._id, name: product.name, image: product.images[0]?.url, price: product.price, quantity: item.quantity, unit: product.unit });
  }
  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date()) && coupon.usedCount < coupon.maxUses && subtotal >= coupon.minOrderAmount) {
      discount = coupon.type === 'percent' ? (subtotal * coupon.value / 100) : coupon.value;
      coupon.usedCount += 1;
      await coupon.save();
    }
  }
  const deliveryFee = subtotal >= 100 ? 0 : 10;
  const total = subtotal - discount + deliveryFee;
  const order = await Order.create({ customer, items: orderItems, subtotal, deliveryFee, discount, total, couponCode, statusHistory: [{ status: 'pending', note: 'Sifariş alındı' }] });
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, soldCount: item.quantity } });
  }
  res.status(201).json(order);
});

router.get('/', protect, async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(query).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit)),
    Order.countDocuments(query)
  ]);
  res.json({ orders, pagination: { page: Number(page), total, pages: Math.ceil(total / limit) } });
});

router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'name images');
  if (!order) return res.status(404).json({ message: 'Sifariş tapılmadı' });
  res.json(order);
});

router.patch('/:id/status', protect, async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Sifariş tapılmadı' });
  order.status = status;
  order.statusHistory.push({ status, note: note || '' });
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = new Date(); }
  await order.save();
  res.json(order);
});

module.exports = router;
