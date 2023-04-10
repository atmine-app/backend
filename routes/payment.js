const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51MmyyDKnGwuMyNJVGYOxw1p1r4VzAouPnvaaBw7bclkPUDWrhlgKlAnf0oATwx77Wc4UT9VMCQKhxHsexWcTv4bG00L3tRbrvV");
const path = require('path');
const router = express.Router();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');

router.use(cors({ origin: "http://localhost:3000" }));
router.use(express.json());

// Serve static files
router.use(express.static(path.join(__dirname, 'build')));

// Catch-all route
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASSWORD,
  }
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

    console.log("Maksym pay", payment.id, payment.status, payment.amount)

    const bookingConfirmationTemplate = fs.readFileSync(path.join(__dirname, '..', 'emails', 'bookingConfirmation.html'), 'utf-8');
    const html = await ejs.render(bookingConfirmationTemplate, { amount, property, startDate, endDate, renter });

    const message = {
      from: `"atmine" <${process.env.TRANSPORTER_EMAIL}>`,
      to: renter.email,
      subject: `📅 Booking Confirmation for property ${property.title} from ${startDate} to ${endDate}`,
      html: html,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return res.status(200).json({ message: "Successful Payment", transactionId: payment.id });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

module.exports = router;