const Category = require('../models/category.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

async function createCategory(req, res) {
    try {
        const { name, description } = req.body;
        if (!name) return errorResponse(res, 'Name is required', 400);

        const existing = await Category.findOne({ name });
        if (existing) return errorResponse(res, 'Category already exists', 409);

        const items = new Category({ name, description });
        await items.save();
        return successResponse(
            res,
            { items },
            'Category created successfully',
            201
        );
    } catch (err) {
        return errorResponse(res, err.message, 400);
    }
}

async function listCategories(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20')));
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Category.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Category.countDocuments()
        ]);

        return successResponse(
            res,
            { items, total, page, limit },
            'Categories retrieved successfully',
            200
        );
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function getCategory(req, res) {
    try {
        const items = await Category.findById(req.params.id);
        if (!items) return errorResponse(res, 'Category not found', 404);
        return successResponse(
            res,
            { items },
            'Category retrieved successfully',
            200
        );
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function updateCategory(req, res) {
    try {
        const { name, description } = req.body;
        const items = await Category.findById(req.params.id);
        if (!items) return errorResponse(res, 'Category not found', 404);

        if (name) items.name = name;
        if (typeof description !== 'undefined') items.description = description;
        await items.save();

        return successResponse(
            res,
            { items },
            'Category updated successfully',
            200
        );
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function updateCategory(req, res) {
    try {
        const { name, description } = req.body;
        const items = await Category.findById(req.params.id);
        if (!items) return res.status(404).json({ message: 'Category not found' });

        if (name) items.name = name;
        if (typeof description !== 'undefined') items.description = description;
        await items.save();
        return successResponse(
            res,
            { items },
            'Category updated successfully',
            200
        );
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

async function deleteCategory(req, res) {
    try {
        const items = await Category.findByIdAndDelete(req.params.id);
        if (!items) return errorResponse(res, 'Category not found', 404);
        return successResponse(
            res,
            null,
            'Category deleted successfully',
            200
        );
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
}

module.exports = {
    createCategory,
    listCategories,
    getCategory,
    updateCategory,
    deleteCategory
};