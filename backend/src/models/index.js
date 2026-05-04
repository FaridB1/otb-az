const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ==================== PRODUCT MODEL ====================
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameAz: { type: String, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  discountPercent: { type: Number, default: 0 },
  images: [{ url: String, publicId: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, trim: true },
  unit: { type: String, default: 'ədəd', trim: true }, // m2, litr, kq, ədəd, m
  stock: { type: Number, default: 0, min: 0 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  flashSaleEnd: { type: Date },
  tags: [String],
  specifications: [{ key: String, value: String }], // Ölçü, Rəng, Material, etc.
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  weight: Number,
  dimensions: { length: Number, width: Number, height: Number }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });
productSchema.index({ price: 1, category: 1 });
productSchema.index({ isFlashSale: 1, flashSaleEnd: 1 });

productSchema.pre('save', function(next) {
  if (this.oldPrice && this.price) {
    this.discountPercent = Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }
  if (!this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0400-\u04FF-]+/g, '')
      .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/ö/g, 'o')
      .replace(/ü/g, 'u').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ç/g, 'c');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

// ==================== CATEGORY MODEL ====================
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  nameAz: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  icon: { type: String, default: '🔨' },
  image: { url: String, publicId: String },
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// ==================== ORDER MODEL ====================
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: 'ədəd' }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: { type: String, required: true },
    city: { type: String, default: 'Bakı' },
    note: String
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 10 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { type: String, enum: ['cash_on_delivery', 'card', 'transfer'], default: 'cash_on_delivery' },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  statusHistory: [{ status: String, note: String, date: { type: Date, default: Date.now } }]
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'OTB' + Date.now().toString().slice(-8).toUpperCase();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

// ==================== ADMIN MODEL ====================
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
adminSchema.methods.comparePassword = async function(p) { return bcrypt.compare(p, this.password); };
adminSchema.methods.toJSON = function() { const o = this.toObject(); delete o.password; return o; };

const Admin = mongoose.model('Admin', adminSchema);

// ==================== REVIEW MODEL ====================
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// ==================== BANNER MODEL ====================
const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: { url: String, publicId: String },
  link: String,
  buttonText: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  type: { type: String, enum: ['hero', 'promo', 'category'], default: 'hero' }
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);

// ==================== COUPON MODEL ====================
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: Date
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = { Product, Category, Order, Admin, Review, Banner, Coupon };
