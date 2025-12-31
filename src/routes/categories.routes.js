const express = require('express');
const router = express.Router();

const categories = require('../controllers/categories.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// public reads
router.get('/', categories.listCategories);
router.get('/:id', categories.getCategory);

// protected mutating routes
router.post('/', authenticate, categories.createCategory);
router.put('/:id', authenticate, categories.updateCategory);
router.delete('/:id', authenticate, categories.deleteCategory);

module.exports = router;