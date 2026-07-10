const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const orderModel = require('../models/order.model');
const productModel = require('../models/product.model');

const REQUIRED_SHIPPING_FIELDS = ['fullName', 'mobile', 'email', 'houseNo', 'area', 'city', 'state', 'pincode'];
const VALID_PAYMENT_METHODS = ['UPI', 'CARD', 'COD'];
const VALID_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

// POST /api/orders (protected)
// Prices and stock are always re-read from the DB — the client only sends
// productId + quantity, so a tampered cart total can never be trusted.
const createOrder = asyncHandler(async (req, res) => {
  const { shipping, paymentMethod, items } = req.body;

  if (!shipping || typeof shipping !== 'object') {
    throw new ApiError(400, 'Shipping information is required');
  }
  for (const field of REQUIRED_SHIPPING_FIELDS) {
    if (!shipping[field] || !String(shipping[field]).trim()) {
      throw new ApiError(400, `Shipping field "${field}" is required`);
    }
  }
  if (!/^[6-9]\d{9}$/.test(shipping.mobile)) {
    throw new ApiError(400, 'Mobile number must be a valid 10-digit Indian number');
  }
  if (!/^\d{6}$/.test(shipping.pincode)) {
    throw new ApiError(400, 'Pincode must be a valid 6-digit number');
  }
  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    throw new ApiError(400, 'Invalid payment method');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  const resolvedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await productModel.findById(item.productId);
    if (!product) {
      throw new ApiError(400, `Product with id ${item.productId} no longer exists`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.name}" (only ${product.stock} left)`);
    }

    resolvedItems.push({
      productId: product.id,
      name: product.name,
      image: product.images[0] || null,
      price: product.price,
      quantity: item.quantity,
    });
    totalAmount += product.price * item.quantity;
  }

  const order = await orderModel.create({
    userId: req.user.id,
    shipping,
    paymentMethod,
    items: resolvedItems,
    totalAmount,
  });

  res.status(201).json({ order });
});

// GET /api/orders/my (protected)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.findByUser(req.user.id);
  res.json({ orders });
});

// GET /api/orders/:id (protected)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this order');
  }
  res.json({ order });
});

// GET /api/orders (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.findAll();
  res.json({ orders });
});

// PATCH /api/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const existing = await orderModel.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Order not found');
  }

  const order = await orderModel.updateStatus(req.params.id, status);
  res.json({ order });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
