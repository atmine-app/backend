const mongoose = require('mongoose');
const {Schema, model} = mongoose;
 
const favoriteSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Tool'
      },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true
  }
);
 
module.exports = model("Favorite", favoriteSchema);
