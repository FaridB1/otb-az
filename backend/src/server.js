require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
  ],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5000 });
app.use('/api/', limiter);

// ✅ Serve uploaded images
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => { res.set('Access-Control-Allow-Origin', '*'); }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/coupons', require('./routes/coupons'));

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'OTB.az API', uploads: uploadsDir }));
app.use((req, res) => res.status(404).json({ message: 'Route tapılmadı' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server xətası' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/otb-az')
  .then(() => {
    console.log('✅ MongoDB bağlandı');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 OTB.az Server port ${PORT}-də işləyir`));
  })
  .catch(err => { console.error('❌ MongoDB xətası:', err); process.exit(1); });

module.exports = app;
