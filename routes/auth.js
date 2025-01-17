const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASSWORD,
  },
});

router.post("/signup", async (req, res, next) => {
  const { email, password, username } = req.body;

  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Please fill all the fields to register" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Not a valid email format" });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res
      .status(400)
      .json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter",
      });
    return;
  }

  try {
    const userInDB = await User.findOne({ email });
    if (userInDB) {
      res
        .status(400)
        .json({ message: `User already exists with email ${email}` });
      return;
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = await User.create({ email, hashedPassword, username });

      fs.readFile("emails/signup.html", "utf8", (err, html) => {
        if (err) {
          throw err;
        }

        const renderedHtml = ejs.render(html, {
          username: username,
          email: email,
        });

        const mailOptions = {
          from: `"atmine" <${process.env.TRANSPORTER_EMAIL}>`,
          to: email,
          subject: "👋 Welcome to atmine!",
          html: renderedHtml,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            console.error(error);
          }
        });
      });

      res.status(201).json({ data: newUser });
    }
  } catch (error) {
    next(error);
  }
});

// @desc    LOG IN user
// @route   POST /api/v1/auth/login
// @access  Public
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Please fill all the fields to login" });
    return;
  }
  try {
    // First let's see if the user exists
    const userInDB = await User.findOne({ email });
    // If they don't exist, return an error
    if (!userInDB) {
      res
        .status(404)
        .json({
          success: false,
          message: `No user registered by email ${email}`,
        });
      return;
    } else {
      const passwordMatches = bcrypt.compareSync(
        password,
        userInDB.hashedPassword
      );
      if (passwordMatches) {
        // Let's create what we want to store in the jwt token
        const payload = {
          email: userInDB.email,
          username: userInDB.username,
          role: userInDB.role,
          avatar: userInDB.avatar,
          status: userInDB.status,
          _id: userInDB._id,
        };
        // Use the jwt middleware to create de token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "30d",
        });
        res.status(200).json({ authToken: authToken });
      } else {
        // If the password is not right, return an error
        res
          .status(401)
          .json({ success: false, message: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
});

// @desc    GET logged in user
// @route   GET /api/v1/auth/me
// @access  Private
router.get("/me", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;
