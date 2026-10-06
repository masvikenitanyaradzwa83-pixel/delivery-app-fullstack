const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true
    },
    senderEmail: {
      type: String,
      default: ''
    },
    senderPhone: {
      type: String,
      default: ''
    },
    recipient: {
      type: String,
      required: true
    },
    recipientPhone: {
      type: String,
      default: ''
    },
    packageType: {
      type: String,
      enum: ['Lunch Box', 'Gift Package', 'Documents', 'Office Supplies', 'Medicine'],
      required: true
    },
    pickupAddress: {
      type: String,
      required: true
    },
    pickupLatitude: {
      type: Number,
      default: null
    },
    pickupLongitude: {
      type: Number,
      default: null
    },
    officeName: {
      type: String,
      required: true
    },
    officeAddress: {
      type: String,
      required: true
    },
    officeLatitude: {
      type: Number,
      default: null
    },
    officeLongitude: {
      type: Number,
      default: null
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'ecocash', 'cash'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cash_pending'],
      default: function() {
        return this.paymentMethod === 'cash' ? 'cash_pending' : 'pending';
      }
    },
    orderStatus: {
      type: String,
      enum: ['created', 'confirmed', 'pickup_scheduled', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
      default: 'created'
    },
    amount: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      default: ''
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    cardDetails: {
      cardholderName: String,
      cardNumber: String,
      expiry: String,
      cvv: String
    },
    ecoCashNumber: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    deliveredAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
