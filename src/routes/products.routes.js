const express = require('express');
const router = express.Router();

const products = require('../controllers/products.controller');
const authenticate = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware'); // handle multipart/form-data

// public read endpoints
router.get('/', products.listProducts);
router.get('/:id', products.getProduct);

// protected create/update/delete (use field name "image" for file)
router.post('/', authenticate, upload.single('image'), products.createProduct);
router.put('/:id', authenticate, upload.single('image'), products.updateProduct);
router.delete('/:id', authenticate, products.deleteProduct);

module.exports = router;