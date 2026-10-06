const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  // Process Stripe payment
  static async processStripePayment(amount, token, description) {
    try {
      const charge = await stripe.charges.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        source: token,
        description
      });

      return {
        success: true,
        transactionId: charge.id,
        amount: charge.amount / 100
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process EcoCash payment (mock)
  static async processEcoCashPayment(phoneNumber, amount, orderId) {
    try {
      // TODO: Integrate with actual EcoCash API
      // This is a mock implementation
      console.log(`Processing EcoCash payment: ${amount} to ${phoneNumber} for order ${orderId}`);

      // Simulate API call
      return {
        success: true,
        transactionId: `ECO-${Date.now()}`,
        phoneNumber,
        amount,
        status: 'pending', // User needs to confirm on their phone
        message: 'Payment request sent to customer phone'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  static async refundPayment(transactionId, amount) {
    try {
      const refund = await stripe.refunds.create({
        charge: transactionId,
        amount: Math.round(amount * 100)
      });

      return {
        success: true,
        refundId: refund.id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = PaymentService;
