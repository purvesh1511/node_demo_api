const Product = require('../models/product.model');
const path = require('path');
const fs = require('fs');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

async function createProduct(req, res) {
    try {
        const body = req.body || {}; // guard when multipart/form-data or req.body is undefined
        const { name, price, description } = body;
        const image = req.file ? req.file.filename : (body.image || '');

        if (!name) return errorResponse(res, 'Name is required', 400);
        if (price == null || isNaN(price)) return errorResponse(res, 'Valid price is required', 400);

        const product = new Product({ name, price, description, image });
        await product.save();
        return successResponse(res, { product }, 'Product created successfully', 201);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function listProducts(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20')));
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Product.countDocuments()
        ]);

        return successResponse(
            res,
            { items, total, page, limit },
            'Products retrieved successfully',
            200
        );
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function getProduct(req, res) {
    try {
        const prod = await Product.findById(req.params.id);
        if (!prod) return errorResponse(res, 'Product not found', 404);
        return successResponse(res, prod, 'Product retrieved successfully', 200);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function updateProduct(req, res) {
    try {
        const body = req.body || {};
        const { name, price, description } = body;
        const prod = await Product.findById(req.params.id);
        if (!prod) return errorResponse(res, 'Product not found', 404);

        if (typeof name !== 'undefined') prod.name = name;
        if (typeof price !== 'undefined') {
            if (isNaN(price)) return errorResponse(res, 'Price must be a number', 400);
            prod.price = price;
        }
        if (typeof description !== 'undefined') prod.description = description;

        if (req.file) {
            if (prod.image) {
                const oldPath = path.join(uploadsDir, prod.image);
                fs.unlink(oldPath, () => { /* ignore unlink errors */ });
            }
            prod.image = req.file.filename;
        } else if (typeof body.image !== 'undefined') {
            if (!body.image && prod.image) {
                const oldPath = path.join(uploadsDir, prod.image);
                fs.unlink(oldPath, () => { /* ignore unlink errors */ });
                prod.image = '';
            }
        }

        await prod.save();
        return successResponse(res, prod, 'Product updated successfully', 200);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function deleteProduct(req, res) {
    try {
        const prod = await Product.findByIdAndDelete(req.params.id);
        if (!prod) return errorResponse(res, 'Product not found', 404);

        if (prod.image) {
            const p = path.join(uploadsDir, prod.image);
            fs.unlink(p, () => { /* ignore unlink errors */ });
        }

        return successResponse(res, null, 'Product deleted successfully', 200);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

module.exports = {
    createProduct,
    listProducts,
    getProduct,
    updateProduct,
    deleteProduct
};