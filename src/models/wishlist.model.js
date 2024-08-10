/* const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  wishlists: [
    {
      productId: {
        type: String,
      },
      count: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const WishList = mongoose.model("WishList", wishlistSchema);
module.exports = WishList;
 */

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Assuming you have a Product model
          required: true,
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const WishList = mongoose.model("WishList", wishlistSchema);
module.exports = WishList;
