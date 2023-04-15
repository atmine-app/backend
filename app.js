require('dotenv').config();
require('./db');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Routers require
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const propertyRouter = require('./routes/properties');
const bookingRouter = require('./routes/bookings');
const reviewRouter = require('./routes/reviews');
const favoriteRouter = require('./routes/favorites');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');
const openaiRouter = require("./routes/openai");

const app = express();

// cookies and loggers
app.use(cors({ origin: [process.env.ORIGIN, 'https://atmine-app.netlify.app'] }));
app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes intro
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/properties', propertyRouter);
app.use('/bookings',bookingRouter )
app.use('/reviews', reviewRouter);
app.use('/favorites', favoriteRouter);
app.use('/user', userRouter);
app.use(paymentRouter)
app.use("/openai", openaiRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err.status === 404) {
    res.status(err.status || 404);
  } else {
    res.status(err.status || 500);
  }
});
/* 
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); */

module.exports = app;
