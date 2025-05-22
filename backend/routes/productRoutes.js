// productRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const owner = require('../middlewares/ownerMiddleware');
const {
  createProduct, getAllProducts, getUserProducts,
  getProductById, updateProduct, deleteProduct
} = require('../controllers/productController');

router.post('/', auth, createProduct);
router.get('/', getAllProducts);
router.get('/my', auth, getUserProducts);
router.get('/:id', getProductById);
router.put('/:id', auth, owner, updateProduct);
router.delete('/:id', auth, owner, deleteProduct);

module.exports = router;
