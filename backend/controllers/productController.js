const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// 🔸 Create avec upload d'image
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body, owner: req.user.userId };
    
    // Si une image a été uploadée
    if (req.file) {
      productData.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const product = new Product(productData);
    await product.save();
    await product.populate('owner', 'username email');
    res.status(201).json(product);
  } catch (err) {
    // Supprimer l'image si erreur de création
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Erreur suppression fichier:', unlinkErr);
      });
    }
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

// 🔸 Update avec gestion d'image
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };
    
    // Récupérer le produit existant pour supprimer l'ancienne image si nécessaire
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    // Si une nouvelle image a été uploadée
    if (req.file) {
      updateData.imageUrl = `/uploads/products/${req.file.filename}`;
      
      // Supprimer l'ancienne image si elle existe
      if (existingProduct.imageUrl && existingProduct.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', existingProduct.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Erreur suppression ancienne image:', err);
        });
      }
    }

    const updated = await Product.findByIdAndUpdate(productId, updateData, { new: true })
      .populate('owner', 'username email');
    
    res.json(updated);
  } catch (err) {
    // Supprimer la nouvelle image si erreur de mise à jour
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Erreur suppression fichier:', unlinkErr);
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Delete avec suppression d'image
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    // Supprimer l'image associée si elle existe
    if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', product.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Erreur suppression image:', err);
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔸 Route de test pour l'upload
exports.uploadTest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }
    
    res.json({
      message: 'Image uploadée avec succès',
      filename: req.file.filename,
      url: `/uploads/products/${req.file.filename}`,
      fullUrl: `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};