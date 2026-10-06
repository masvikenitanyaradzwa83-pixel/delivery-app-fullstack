const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyToken);
router.use(verifyRole(['admin']));

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['created', 'confirmed', 'pickup_scheduled'] } });
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const revenueByPaymentMethod = await Order.aggregate([
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      totalOrders,
      completedOrders,
      pendingOrders,
      totalUsers,
      totalDrivers,
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueByPaymentMethod
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

// Get all orders (admin view)
router.get('/orders', async (req, res) => {
  try {
    const { status, paymentMethod, limit = 50, skip = 0 } = req.query;
    const filter = {};

    if (status) filter.orderStatus = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('assignedDriver', 'name phone vehicleType');

    const total = await Order.countDocuments(filter);

    res.json({ orders, total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers', error: error.message });
  }
});

// Approve driver
router.patch('/drivers/:id/approve', async (req, res) => {
  try {
    const driver = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve driver', error: error.message });
  }
});

// Deactivate driver
router.patch('/drivers/:id/deactivate', async (req, res) => {
  try {
    const driver = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate driver', error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get revenue report
router.get('/reports/revenue', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { paymentStatus: 'completed' };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const revenue = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch revenue report', error: error.message });
  }
});

// Get delivery report
router.get('/reports/deliveries', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { orderStatus: 'delivered' };

    if (startDate || endDate) {
      filter.deliveredAt = {};
      if (startDate) filter.deliveredAt.$gte = new Date(startDate);
      if (endDate) filter.deliveredAt.$lte = new Date(endDate);
    }

    const deliveries = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$deliveredAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch delivery report', error: error.message });
  }
});

module.exports = router;
