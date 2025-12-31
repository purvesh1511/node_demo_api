const authService = require('../services/auth.service');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(
      res,
      { user },
      'User registered successfully',
      201
    );
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    const token = generateToken(user._id);
    return successResponse(res, { token, user });
  } catch (err) {
    return errorResponse(res, err.message, 401);
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, { user });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};