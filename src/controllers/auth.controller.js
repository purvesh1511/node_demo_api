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
