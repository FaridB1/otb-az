const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Yalnız şəkil faylları qəbul edilir'));
  }
});

let cloudinaryConfigured = false;
let cloudinary;
try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    cloudinaryConfigured = true;
    console.log('☁️  Cloudinary konfiqurasiya edildi');
  } else {
    console.log('⚠️  Cloudinary konfiqurasiya olunmayıb - lokal saxlama istifadə edilir');
  }
} catch (e) {
  console.log('⚠️  Lokal saxlama aktiv');
}

router.post('/image', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Şəkil tapılmadı' });
  try {
    if (cloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'otb-products', transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }] });
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.json({ url: result.secure_url, publicId: result.public_id });
    }
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    res.json({ url: `${backendUrl}/uploads/${req.file.filename}`, publicId: req.file.filename });
  } catch (err) {
    console.error('Upload xətası:', err);
    res.status(500).json({ message: 'Şəkil yükləmə xətası' });
  }
});

router.post('/images', protect, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'Şəkillər tapılmadı' });
  const results = [];
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  for (const file of req.files) {
    try {
      if (cloudinaryConfigured) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'otb-products' });
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        results.push({ url: result.secure_url, publicId: result.public_id });
      } else {
        results.push({ url: `${backendUrl}/uploads/${file.filename}`, publicId: file.filename });
      }
    } catch {
      results.push({ url: `${backendUrl}/uploads/${file.filename}`, publicId: file.filename });
    }
  }
  res.json(results);
});

router.delete('/image', protect, async (req, res) => {
  const { publicId } = req.body;
  try {
    if (cloudinaryConfigured && publicId && publicId.includes('/')) {
      await cloudinary.uploader.destroy(publicId);
    } else if (publicId) {
      const filePath = path.join(uploadsDir, publicId);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: 'Şəkil silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silinmə xətası' });
  }
});

module.exports = router;
