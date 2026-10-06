const express = require('express');
const Order = require('../models/Order');
const PaymentService = require('../services/payment');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Process card payment
router.post('/process-card', verifyToken, async (req, res) => {
  try {
    const { orderId, stripeToken, amount } = req.body;

    if (!orderId || !stripeToken || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const result = await PaymentService.processStripePayment(
      amount,
      stripeToken,
      `Order ${orderId}`
    );

    if (result.success) {
      order.paymentStatus = 'completed';
      await order.save();

      res.json({
        message: 'Payment successful',
        transactionId: result.transactionId,
        order
      });
    } else {
      res.status(400).json({
        message: 'Payment failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
});

// Process EcoCash payment
router.post('/process-ecocash', verifyToken, async (req, res) => {
  try {
    const { orderId, phoneNumber, amount } = req.body;

    if (!orderId || !phoneNumber || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const result = await PaymentService.processEcoCashPayment(
      phoneNumber,
      amount,
      orderId
    );

    if (result.success) {
      // Set to pending until user confirms on their phone
      order.paymentStatus = 'pending';
      order.ecoCashNumber = phoneNumber;
      await order.save();

      res.json({
        message: result.message,
        transactionId: result.transactionId,
        status: result.status,
        order
      });
    } else {
      res.status(400).json({
        message: 'EcoCash payment failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'EcoCash payment processing failed', error: error.message });
  }
});

// Confirm cash payment on pickup
router.post('/confirm-cash/:orderId', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentMethod !== 'cash') {
      return res.status(400).json({ message: 'Order is not a cash payment' });
    }

    order.paymentStatus = 'completed';
    await order.save();

    res.json({
      message: 'Cash payment confirmed',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm payment', error: error.message });
  }
});

// Get payment history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ $or: [{ sender: req.user.email }, { assignedDriver: req.user.id }] })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history', error: error.message });
  }
});

module.exports = router;
