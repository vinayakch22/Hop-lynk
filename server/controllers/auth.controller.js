import { signupService, loginService, logoutService, updateProfileService } from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    const user = await signupService({ name, email, password }, res);
    res.status(201).json({ success: true, message: 'Account created successfully', data: user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await loginService({ email, password }, res);
    res.status(200).json({ success: true, message: 'Logged in successfully', data: user });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  try {
    logoutService(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMe = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await updateProfileService(req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (err) {
    next(err);
  }
};
