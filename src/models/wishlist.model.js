const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
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
    in_stock: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const WishList = mongoose.model("WishList", wishlistSchema);
module.exports = WishList;
