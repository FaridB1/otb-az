const express = require('express');
const router = express.Router();
const { Product, Order } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  const [totalProducts, totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'delivered' })
  ]);
  const revenueResult = await Order.aggregate([
    { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;
  const recentOrders = await Order.find().sort('-createdAt').limit(10);
  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  res.json({ totalProducts, totalOrders, pendingOrders, deliveredOrders, totalRevenue, recentOrders, monthlyRevenue });
});
module.exports = router;
