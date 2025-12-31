exports.successResponse = (res, data = {}, message = 'success', status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message
  });
};

exports.errorResponse = (res, message = 'error', status = 400) => {
  return res.status(status).json({
    success: false,
    data: {},
    message
  });
};
