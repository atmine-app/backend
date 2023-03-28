const express = require('express');
const router = express.Router();
require('dotenv').config();
const Payment = require('../models/payment');

router.post('/payment', async (req, res) => {
  const { amount, currency, userId } = req.body;

  try {
    // create a payment intent on Stripe
    const paymentIntent = await axios.post('https://api.stripe.com/v1/payment_intents', {
      amount,
      currency,
      payment_method_types: ['card'],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    });

    // send the payment confirmation request to Stripe
    const confirmPayment = await axios.post(`https://api.stripe.com/v1/payment_intents/${paymentIntent.data.id}/confirm`, {
      payment_method: 'pm_card_visa', // replace with the actual payment method ID
    }, {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    });

    // create a new payment document in MongoDB
    const payment = new Payment({
      user: userId, // replace with the actual user ID
      amount,
      currency,
      paymentIntentId: confirmPayment.data.id,
      status: confirmPayment.data.status,
    });

    await payment.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to process payment' });
  }
});

module.exports = router;