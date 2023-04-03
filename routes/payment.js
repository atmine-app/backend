const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51MmyyDKnGwuMyNJVGYOxw1p1r4VzAouPnvaaBw7bclkPUDWrhlgKlAnf0oATwx77Wc4UT9VMCQKhxHsexWcTv4bG00L3tRbrvV");
const path = require('path');
const router = express.Router();

router.use(cors({ origin: "http://localhost:3000" }));
router.use(express.json());

// Serve static files
router.use(express.static(path.join(__dirname, 'build')));

// Catch-all route
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

router.post("/api/checkout", async (req, res) => {
  // we can get more data to find in db
  const { id, amount } = req.body;

  try {
    console.log("Payment Request Received! ", amount)
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Gaming Keyboard",
      payment_method: id,
      confirm: true, //confirm the payment at the same time
    });

    console.log(payment.id);

    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

module.exports = router;