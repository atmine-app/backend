const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51MmyyDKnGwuMyNJVGYOxw1p1r4VzAouPnvaaBw7bclkPUDWrhlgKlAnf0oATwx77Wc4UT9VMCQKhxHsexWcTv4bG00L3tRbrvV');

router.post('/checkout', async (req, res) => {
  const { payment_method_id, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: payment_method_id,
      amount: amount,
      currency: 'eur',
      confirmation_method: 'manual',
      confirm: true,
    });

    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;