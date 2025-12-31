const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const { successResponse, errorResponse } = require('../utils/apiResponse');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return errorResponse(res, 'No token provided', 401);

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // attach decoded token (e.g. { id, email, ... })
        next();
    } catch (err) {
        return errorResponse(res, 'Invalid token', 401);
    }
}

module.exports = { authenticate };