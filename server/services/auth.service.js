import User from '../models/User.model.js';
import { generateToken } from '../utils/generateToken.js';
import { AppError } from '../middleware/error.middleware.js';

export const signupService = async ({ name, email, password }, res) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already in use', 409);

  const user = await User.create({ name, email, password });
  generateToken(user._id, res);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const loginService = async ({ email, password }, res) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  generateToken(user._id, res);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const logoutService = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
};
