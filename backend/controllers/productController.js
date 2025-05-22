const Product = require('../models/Product');

// 🔸 Create
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body, owner: req.user.userId });
    await product.save();
    await product.populate('owner', 'username email');
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Read All (Public with filters)
exports.getAllProducts = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Read (User's own)
exports.getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.userId }).populate('owner', 'username email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Read One (public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'username email');
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Update
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('owner', 'username email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Delete
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};