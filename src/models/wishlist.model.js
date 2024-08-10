
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const WishList = mongoose.model("WishList", wishlistSchema);
module.exports = WishList;
