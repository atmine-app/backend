const mongoose = require('mongoose');

const BookingAlertSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingStart: {
    type: Date,
    required: true,
  },
  bookingEnd: {
    type: Date,
    required: true,
  },
  alertStatus: {
    type: String,
    required: true,
    enum: ['pending', 'sent', 'cancelled'],
    default: 'pending',
  },
},
{
  timestamps: true
});

const BookingAlert = mongoose.model('BookingAlert', BookingAlertSchema);

module.exports = BookingAlert;
