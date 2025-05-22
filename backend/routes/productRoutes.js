const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');

// ✅ ROUTES SPÉCIFIQUES EN PREMIER
// Route pour récupérer les produits de l'utilisateur connecté
router.get('/my-products', authMiddleware, productController.getUserProducts);

// ✅ ENSUITE LES ROUTES AVEC PARAMÈTRES DYNAMIQUES
// Route publique pour récupérer tous les produits
router.get('/', productController.getAllProducts);

// Route publique pour récupérer un produit par ID
router.get('/:id', productController.getProductById);

// Routes protégées pour créer un produit
router.post('/', authMiddleware, productController.createProduct);

// Routes protégées pour modifier/supprimer (avec vérification propriétaire)
router.put('/:id', authMiddleware, ownerMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, ownerMiddleware, productController.deleteProduct);

module.exports = router;