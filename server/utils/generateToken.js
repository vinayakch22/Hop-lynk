import jwt from 'jsonwebtoken';

/**
 * Signs a JWT and sets it as an HTTP-only, SameSite=Strict cookie.
 * @param {string} userId - MongoDB ObjectId string
 * @param {object} res - Express response object
 */
export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  });

  return token;
};
