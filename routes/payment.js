require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);

const path = require("path");
const router = express.Router();

router.use(cors({ origin: process.env.ORIGIN }));
router.use(express.json());

// Serve static files
router.use(express.static(path.join(__dirname, "build")));

// Catch-all route
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

router.post("/api/checkout", async (req, res) => {
  const { id, amount, property, renter, startDate, endDate } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "EUR",
      description: `Booking for property ${property._id}`,
      payment_method: id,
      confirm: true,
    });

    return res
      .status(200)
      .json({ message: "Successful Payment", transactionId: payment.id });
  } catch (error) {
    return res.json({ message: error.raw.message });
  }
});

module.exports = router;
