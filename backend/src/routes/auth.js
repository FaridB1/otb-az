const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'otb-dev-secret', { expiresIn: '30d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email və şifrə tələb olunur' });
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !admin.isActive) return res.status(401).json({ message: 'Email və ya şifrə yanlışdır' });
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Email və ya şifrə yanlışdır' });
  admin.lastLogin = new Date();
  await admin.save();
  res.json({ token: generateToken(admin._id), admin });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json(req.admin));

// POST /api/auth/register-first-admin (only if no admins exist)
router.post('/register-first-admin', async (req, res) => {
  const count = await Admin.countDocuments();
  if (count > 0) return res.status(403).json({ message: 'Admin artıq mövcuddur' });
  const admin = await Admin.create({ ...req.body, role: 'superadmin' });
  res.status(201).json({ token: generateToken(admin._id), admin });
});

module.exports = router;
