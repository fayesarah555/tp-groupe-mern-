const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// ✅ ROUTES SPÉCIFIQUES EN PREMIER
// Route pour récupérer les produits de l'utilisateur connecté
router.get('/my-products', authMiddleware, productController.getUserProducts);

// Route de test pour l'upload
router.post('/upload-test', upload.single('image'), productController.uploadTest);

// ✅ ENSUITE LES ROUTES AVEC PARAMÈTRES DYNAMIQUES
// Route publique pour récupérer tous les produits
router.get('/', productController.getAllProducts);

// Route publique pour récupérer un produit par ID
router.get('/:id', productController.getProductById);

// Routes protégées pour créer un produit (avec upload d'image optionnel)
router.post('/', authMiddleware, upload.single('image'), productController.createProduct);

// Routes protégées pour modifier/supprimer (avec vérification propriétaire et upload optionnel)
router.put('/:id', authMiddleware, ownerMiddleware, upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, ownerMiddleware, productController.deleteProduct);

module.exports = router;