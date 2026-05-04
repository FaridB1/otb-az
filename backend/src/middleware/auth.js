const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Giriş tələb olunur' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin || !req.admin.isActive) return res.status(401).json({ message: 'İcazəsiz giriş' });
    next();
  } catch {
    res.status(401).json({ message: 'Token etibarsızdır' });
  }
};

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

module.exports = { protect, generateToken };
