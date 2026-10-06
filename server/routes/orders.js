const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50).populate('assignedDriver', 'name phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('assignedDriver', 'name phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const {
      sender,
      senderEmail,
      senderPhone,
      recipient,
      recipientPhone,
      packageType,
      pickupAddress,
      officeName,
      officeAddress,
      paymentMethod,
      amount,
      notes,
      cardDetails,
      ecoCashNumber
    } = req.body;

    // Validate required fields
    if (!sender || !recipient || !packageType || !pickupAddress || !officeName || !officeAddress || !paymentMethod || !amount) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    const newOrder = new Order({
      sender,
      senderEmail: senderEmail || '',
      senderPhone: senderPhone || '',
      recipient,
      recipientPhone: recipientPhone || '',
      packageType,
      pickupAddress,
      officeName,
      officeAddress,
      paymentMethod,
      amount: Number(amount),
      notes: notes || '',
      cardDetails: paymentMethod === 'card' ? cardDetails : null,
      ecoCashNumber: paymentMethod === 'ecocash' ? ecoCashNumber : null,
      orderStatus: 'confirmed',
      paymentStatus: paymentMethod === 'cash' ? 'cash_pending' : 'pending'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (orderStatus === 'delivered') updateData.deliveredAt = new Date();

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedDriver', 'name phone');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// Assign driver to order
router.patch('/:id/assign-driver', async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: 'Driver ID is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedDriver: driverId, orderStatus: 'pickup_scheduled' },
      { new: true }
    ).populate('assignedDriver', 'name phone');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign driver', error: error.message });
  }
});

// Get orders by payment method
router.get('/payment-method/:method', async (req, res) => {
  try {
    const orders = await Order.find({ paymentMethod: req.params.method })
      .sort({ createdAt: -1 })
      .populate('assignedDriver', 'name phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get orders by status
router.get('/status/:status', async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: req.params.status })
      .sort({ createdAt: -1 })
      .populate('assignedDriver', 'name phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

module.exports = router;
