const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  dateCreate: {
    type: Date,
    required: true,
  },
  dateUpdate: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Product", productSchema);


