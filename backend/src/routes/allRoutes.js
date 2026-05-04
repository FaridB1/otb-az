// ===================== CATEGORIES =====================
const express = require('express');
const { protect } = require('../middleware/auth');
const { Category, Order, Review, Banner, Product, Coupon } = require('../models');

const catRouter = express.Router();
catRouter.get('/', async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort('order');
  res.json(cats);
});
catRouter.post('/', protect, async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(cat);
});
catRouter.put('/:id', protect, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
});
catRouter.delete('/:id', protect, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Kateqoriya silindi' });
});

// ===================== ORDERS =====================
const orderRouter = express.Router();

// POST /api/orders - create order (public)
orderRouter.post('/', async (req, res) => {
  const { customer, items, couponCode } = req.body;

  // Validate products and calculate totals
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isAvailable) return res.status(400).json({ message: `${item.name} mövcud deyil` });
    if (product.stock < item.quantity) return res.status(400).json({ message: `${product.name} stokda yoxdur` });
    subtotal += product.price * item.quantity;
    orderItems.push({ product: product._id, name: product.name, image: product.images[0]?.url, price: product.price, quantity: item.quantity });
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

  const deliveryFee = subtotal >= 150 ? 0 : 5;
  const total = subtotal - discount + deliveryFee;

  const order = await Order.create({
    customer, items: orderItems, subtotal, deliveryFee, discount,
    total, couponCode, statusHistory: [{ status: 'pending', note: 'Sifariş alındı' }]
  });

  // Update stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, soldCount: item.quantity } });
  }

  res.status(201).json(order);
});

// GET /api/orders - admin list
orderRouter.get('/', protect, async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(query).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit)),
    Order.countDocuments(query)
  ]);
  res.json({ orders, pagination: { page: Number(page), total, pages: Math.ceil(total / limit) } });
});

// GET /api/orders/:id
orderRouter.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'name images');
  if (!order) return res.status(404).json({ message: 'Sifariş tapılmadı' });
  res.json(order);
});

// PATCH /api/orders/:id/status
orderRouter.patch('/:id/status', protect, async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Sifariş tapılmadı' });
  order.status = status;
  order.statusHistory.push({ status, note: note || '' });
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = new Date(); }
  await order.save();
  res.json(order);
});

// ===================== REVIEWS =====================
const reviewRouter = express.Router();
reviewRouter.post('/', async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});
reviewRouter.get('/product/:productId', async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, isApproved: true }).sort('-createdAt');
  res.json(reviews);
});
reviewRouter.get('/', protect, async (req, res) => {
  const reviews = await Review.find().populate('product', 'name').sort('-createdAt').limit(50);
  res.json(reviews);
});
reviewRouter.patch('/:id/approve', protect, async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  // Update product rating
  const reviews = await Review.find({ product: review.product, isApproved: true });
  const rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(review.product, { rating: Math.round(rating * 10) / 10, reviewCount: reviews.length });
  res.json(review);
});
reviewRouter.delete('/:id', protect, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Rəy silindi' });
});

// ===================== UPLOAD =====================
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cloudinary konfiqurasiya yoxlama
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let cloudinary;
if (useCloudinary) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary aktiv');
} else {
  console.log('⚠️  Cloudinary konfiqurasiya olunmayıb - lokal saxlama istifadə edilir');
}

// Lokal upload qovluğu
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Yalnız şəkil faylları'), false);
    cb(null, true);
  }
});

// Şəkil yükləmə köməkçi funksiyası
async function uploadFile(fileBuffer, originalname) {
  if (useCloudinary) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'cipcip', resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
        (err, result) => err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id })
      ).end(fileBuffer);
    });
  } else {
    // Lokal saxlama - development üçün
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E6) + path.extname(originalname);
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, fileBuffer);
    const url = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${filename}`;
    return { url, publicId: filename };
  }
}

const uploadRouter = express.Router();

uploadRouter.post('/image', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Şəkil tələb olunur' });
  const result = await uploadFile(req.file.buffer, req.file.originalname);
  res.json(result);
});

uploadRouter.post('/images', protect, upload.array('images', 10), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'Şəkillər tələb olunur' });
  const uploads = await Promise.all(
    req.files.map(file => uploadFile(file.buffer, file.originalname))
  );
  res.json(uploads);
});

uploadRouter.delete('/image', protect, async (req, res) => {
  const { publicId } = req.body;
  if (useCloudinary) {
    await cloudinary.uploader.destroy(publicId);
  } else {
    const filepath = path.join(uploadDir, publicId);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }
  res.json({ message: 'Şəkil silindi' });
});

// ===================== BANNERS =====================
const bannerRouter = express.Router();
bannerRouter.get('/', async (req, res) => {
  const { type } = req.query;
  const query = { isActive: true };
  if (type) query.type = type;
  const banners = await Banner.find(query).sort('order');
  res.json(banners);
});
bannerRouter.post('/', protect, async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});
bannerRouter.put('/:id', protect, async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(banner);
});
bannerRouter.delete('/:id', protect, async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: 'Banner silindi' });
});

// ===================== DASHBOARD =====================
const dashRouter = express.Router();
dashRouter.get('/stats', protect, async (req, res) => {
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

// ===================== WISHLIST =====================
const wishlistRouter = express.Router();
// Wishlist stored client-side, this just validates product IDs
wishlistRouter.post('/validate', async (req, res) => {
  const { productIds } = req.body;
  const products = await Product.find({ _id: { $in: productIds }, isAvailable: true })
    .select('name price images isAvailable stock');
  res.json(products);
});

// ===================== COUPON VALIDATION =====================
const couponRouter = express.Router();
couponRouter.post('/validate', async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ message: 'Kupon tapılmadı' });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Kuponun müddəti bitib' });
  if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Kupon limiti dolub' });
  if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum sifariş məbləği: ${coupon.minOrderAmount} AZN` });
  const discount = coupon.type === 'percent' ? (orderAmount * coupon.value / 100) : coupon.value;
  res.json({ valid: true, discount, coupon });
});

// Export all routers
const app = express();
module.exports = {
  catRouter, orderRouter, reviewRouter, uploadRouter,
  bannerRouter, dashRouter, wishlistRouter, couponRouter
};
