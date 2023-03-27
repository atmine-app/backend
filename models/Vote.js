const { Schema, model } = require('mongoose');
 
const voteSchema = new Schema(
  {
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property'
      },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: [true, 'Please rate'],
      default: 5,
    },
  },
  {
    timestamps: true
  }
);
 
const Vote = model('Vote', voteSchema);
module.exports = Vote;