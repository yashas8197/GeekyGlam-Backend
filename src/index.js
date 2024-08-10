const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

const Products = require("./models/products.model");
const Reviews = require("./models/reviews.model");
const WishList = require("./models/wishlist.model");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

initializeDatabase();

// const jsonData = fs.readFileSync("reviews.json", "utf8");
// const reviewsData = JSON.parse(jsonData);

/* async function seedData() {
  try {
    for (const reviewData of reviewsData) {
      const newReview = new Reviews({
        name: reviewData.name,
        ratings: reviewData.ratings,
        avatarPhoto: reviewData.avatarPhoto,
        date: reviewData.date,
        reviews: reviewData.reviews,
        email: reviewData.email,
      });

      await newReview.save();
      console.log("product data", newReview.title);
    }
  } catch (error) {
    console.log("Error seeding the data", error);
  }
} */

// seedData();

async function getProductsByCategory(categoryType) {
  try {
    const products = await Products.find({ category: categoryType });
    return { products: products };
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const products = await Products.find();
    return { products: products };
  } catch (error) {
    throw error;
  }
}

app.get("/products/:categoryType", async (req, res) => {
  try {
    const categoryType = req.params.categoryType;
    let response;
    if (categoryType === "All") {
      response = await getAllProducts();
    } else {
      response = await getProductsByCategory(categoryType);
    }

    if (response.products.length === 0) {
      return res.status(404).json({ message: "No Products Found" });
    }

    return res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getProductById(productId) {
  try {
    const product = await Products.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);
    if (product) {
      res.status(200).json({ message: "Product fetching successful", product });
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to fetch Product" });
  }
});

app.get("/wishlist", async (req, res) => {
  try {
    const wishlists = await WishList.find();
    res.status(200).json(wishlists);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

async function addWishlist(productId) {
  try {
    let wishlist = await WishList.findOne();

    if (!wishlist) {
      wishlist = new WishList({
        items: [{ productId, count: 1 }],
      });
      await wishlist.save();
      return res.status(201).json(wishlist);
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      wishlist.items[itemIndex].count += 1;
    } else {
      wishlist.items.push({ productId, count: 1 });
    }

    await wishlist.save();

    return wishlist;
  } catch (error) {
    throw error;
  }
}

app.post("/wishlist", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const response = await addWishlist(productId);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server connected to port http://localhost:${PORT}`);
});
