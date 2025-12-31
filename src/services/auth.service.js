const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.registerUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword
  });
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw 'User not found';

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw 'Invalid credentials';

  return user;
};
