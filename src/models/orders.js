const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    image: {
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
    category: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
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
    quantity: {
      type: Number,
      require: true,
      default: 1,
    },
    payment_id: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    deliverMethod: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    street: {
      type: String,
      require: true,
    },
    zip: {
      type: Number,
      require: true,
    },
    deliveryFee: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
