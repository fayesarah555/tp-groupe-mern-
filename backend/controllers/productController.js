// productController.js
const Product = require('../models/Product');

// 🔸 Create
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body, owner: req.user.userId });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Read All (Public with filters)
exports.getAllProducts = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  const filter = {};

  if (name) filter.name = { $regex: name, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const products = await Product.find(filter).populate('owner', 'username email');
  res.json(products);
};

// 🔹 Read (User's own)
exports.getUserProducts = async (req, res) => {
  const products = await Product.find({ owner: req.user.userId });
  res.json(products);
};

// 🔹 Read One (public)
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('owner', 'username email');
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(product);
};

// 🔸 Update
exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// 🔸 Delete
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produit supprimé' });
};
