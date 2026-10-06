const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware
router.use(verifyToken);

// Get assigned orders for driver
router.get('/my-orders', verifyRole(['driver']), async (req, res) => {
  try {
    const orders = await Order.find({
      assignedDriver: req.user.id,
      orderStatus: { $in: ['pickup_scheduled', 'picked_up', 'in_transit'] }
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get available orders for driver to accept
router.get('/available-orders', verifyRole(['driver']), async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: 'confirmed',
      assignedDriver: null
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available orders', error: error.message });
  }
});

// Accept order
router.post('/accept-order/:orderId', verifyRole(['driver']), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        assignedDriver: req.user.id,
        orderStatus: 'pickup_scheduled'
      },
      { new: true }
    ).populate('assignedDriver', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept order', error: error.message });
  }
});

// Update order status
router.patch('/orders/:orderId/status', verifyRole(['driver']), async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['picked_up', 'in_transit', 'delivered'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { orderStatus };
    if (orderStatus === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      updateData,
      { new: true }
    ).populate('assignedDriver', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// Update driver location (for live tracking)
router.patch('/me/location', verifyRole(['driver']), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const driver = await User.findByIdAndUpdate(
      req.user.id,
      {
        currentLocation: {
          latitude,
          longitude,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-password');

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
});

// Update availability
router.patch('/me/availability', verifyRole(['driver']), async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: 'isAvailable must be boolean' });
    }

    const driver = await User.findByIdAndUpdate(
      req.user.id,
      { isAvailable },
      { new: true }
    ).select('-password');

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
});

// Get driver profile
router.get('/me', verifyRole(['driver']), async (req, res) => {
  try {
    const driver = await User.findById(req.user.id).select('-password');
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver profile', error: error.message });
  }
});

module.exports = router;
