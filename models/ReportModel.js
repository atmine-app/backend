const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportType: {
    type: String,
    required: true,
  },
  reportDescription: {
    type: String,
    required: true,
  },
  reportDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    required: true,
    default: 'open',
  },
  adminComment: {
    type: String,
    default: '',
  },
},
{
  timestamps: true
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;