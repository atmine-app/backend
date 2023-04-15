require('dotenv').config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);

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
  const { id, amount, property, renter, startDate, endDate } = req.body;

  try {
    console.log("Payment Request Received! ", amount, id)
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: `Booking for property ${property._id}`, 
      payment_method: id,
      confirm: true, 
    });

    console.log("Payment details:", payment.id, payment.status, payment.amount)

    // Remove the email sending logic from here

    return res.status(200).json({ message: "Successful Payment", transactionId: payment.id });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

module.exports = router;