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

export const updateProfileService = async (userId, { name, email, currentPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  if (!name) throw new AppError('Name is required', 400);
  if (name.length > 50) throw new AppError('Name cannot exceed 50 characters', 400);

  if (email && email.toLowerCase() !== user.email.toLowerCase()) {
    if (!currentPassword) {
      throw new AppError('Current password is required to change email address', 401);
    }
    const isCorrect = await user.comparePassword(currentPassword);
    if (!isCorrect) {
      throw new AppError('Incorrect password. Re-authentication failed.', 401);
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new AppError('Please enter a valid email address', 400);
    }

    const emailUsed = await User.findOne({ email: email.toLowerCase() });
    if (emailUsed) {
      throw new AppError('Email is already in use by another account', 409);
    }

    user.email = email.toLowerCase();
  }

  user.name = name;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const updatePasswordService = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters long', 400);
  }

  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const isCorrect = await user.comparePassword(currentPassword);
  if (!isCorrect) {
    throw new AppError('Incorrect current password', 401);
  }

  user.password = newPassword;
  await user.save();
};
