const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const userModel = require('../models/user.model');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...safe } = user;
  return safe;
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'Please provide a valid email address');
  }
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  const existing = await userModel.findByEmail(email.toLowerCase());
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const hashed = await hashPassword(password);
  const user = await userModel.create({ name, email: email.toLowerCase(), password: hashed, phone });

  const token = signToken({ id: user.id, role: user.role });
  res.status(201).json({ user, token });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await userModel.findByEmail(email.toLowerCase());
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ id: user.id, role: user.role });
  res.json({ user: sanitizeUser(user), token });
});

// POST /api/auth/logout
// JWTs are stateless and stored client-side, so logout simply confirms the
// action; the frontend is responsible for discarding the token.
const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { register, login, logout, getMe };
