const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/user.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');

// GET /api/users (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.findAll();
  res.json({ users });
});

// GET /api/users/stats (admin) — powers the admin dashboard cards.
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, totalUsers, totalRevenue] = await Promise.all([
    productModel.count(),
    orderModel.count(),
    userModel.count(),
    orderModel.totalRevenue(),
  ]);

  res.json({ totalProducts, totalOrders, totalUsers, totalRevenue });
});

module.exports = { getAllUsers, getDashboardStats };
