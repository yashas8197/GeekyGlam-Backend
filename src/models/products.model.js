const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    size: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    original_price: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    delivery_time: {
      type: Number,
      required: true,
    },
    reviews: {
      type: String,
      required: true,
    },
    reviewsList: [
      {
        name: String,
        ratings: Number,
        reviews: String,
        avatarPhoto: String,
        date: String,
      },
    ],
    in_stock: {
      type: Boolean,
      required: true,
    },
    is_wished: {
      type: Boolean,
      required: true,
    },
    in_cart: {
      type: Boolean,
      required: true,
    },
    quantity: {
      type: Number,
      require: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", productsSchema);
module.exports = Products;
