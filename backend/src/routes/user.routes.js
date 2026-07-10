const express = require('express');
const { getAllUsers, getDashboardStats } = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);
router.get('/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
