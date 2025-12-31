const mongoose = require('mongoose');

const ProductCommentSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductComment',
        default: null
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// optional index to speed up product comment queries
ProductCommentSchema.index({ productId: 1, createdAt: -1 });

module.exports = mongoose.model('ProductComment', ProductCommentSchema);