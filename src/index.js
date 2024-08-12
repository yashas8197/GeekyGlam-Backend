const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const app = express();
const cors = require("cors");

const Products = require("./models/products.model");
const WishList = require("./models/wishlist.model");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

initializeDatabase();

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
    res.status(500).json({ error: "failed to fetch Product" });
  }
});

app.get("/api/wishlist", async (req, res) => {
  try {
    const wishlists = await WishList.find();
    res.status(200).json(wishlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/wishlist", async (req, res) => {
  const {
    image,
    category,
    rating,
    size,
    description,
    title,
    trending,
    original_price,
    price,
    delivery_time,
    reviews,
    in_stock,
  } = req.body;

  const wishlistItem = new WishList({
    image,
    category,
    rating,
    size,
    description,
    title,
    trending,
    original_price,
    price,
    delivery_time,
    reviews,
    in_stock,
  });

  try {
    const newItem = await wishlistItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getSearchSuggestionByTitle(productTitle) {
  try {
    const productSearchByTitle = await Products.find({
      title: { $regex: productTitle, $options: "i" },
    });
    return productSearchByTitle;
  } catch (error) {
    throw error;
  }
}

app.get("/products", async (req, res) => {
  try {
    const q = req.query.q;
    const matchesProductTitle = await getSearchSuggestionByTitle(q);
    if (matchesProductTitle.length > 0) {
      res.status(200).json({ products: matchesProductTitle });
    } else {
      res.status(404).json({ error: "No Products Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server connected to port http://localhost:${PORT}`);
});
