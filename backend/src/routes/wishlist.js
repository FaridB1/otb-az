const express = require('express');
const router = express.Router();
const { Product } = require('../models');

router.post('/validate', async (req, res) => {
  const { productIds } = req.body;
  const products = await Product.find({ _id: { $in: productIds }, isAvailable: true }).select('name price images isAvailable stock unit');
  res.json(products);
});
module.exports = router;
