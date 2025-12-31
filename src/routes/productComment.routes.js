const express = require('express');
const router = express.Router();

const productComment = require('../controllers/productComment.controller');
const authenticate = require('../middlewares/auth.middleware');


router.post('/', authenticate, productComment.addComment);
router.post('/reply', authenticate, productComment.replyComment);
router.get('/:productId', productComment.getProductComments);
router.delete('/:id', authenticate, productComment.deleteComment);

module.exports = router;
