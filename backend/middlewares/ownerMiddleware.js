// ownerMiddleware.js
const Product = require('../models/Product');

const ownerMiddleware = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

  if (product.owner.toString() !== req.user.userId) {
    return res.status(403).json({ error: 'Accès interdit: vous n\'êtes pas le propriétaire' });
  }

  next();
};

module.exports = ownerMiddleware;
