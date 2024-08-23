const { initializeDatabase } = require("./db/db.connect");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const Products = require("./models/products.model");
const Order = require("./models/orders");

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

async function updateProductById(productId, dataToUpdate) {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      dataToUpdate,
      {
        new: true,
      }
    );

    return updatedProduct;
  } catch (error) {
    throw error;
  }
}

app.post("/product/:productId", async (req, res) => {
  try {
    const updatedProduct = await updateProductById(
      req.params.productId,
      req.body
    );

    if (updatedProduct) {
      return res
        .status(200)
        .json({ message: "product updated successfully", updatedProduct });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const wishedProducts = await Products.find({ is_wished: true });

    if (wishedProducts.length > 0) {
      res.status(200).json({ wishlist: wishedProducts });
    } else {
      res.status(404).json({ message: "No items in wishlist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/product", async (req, res) => {
  try {
    const cartItems = await Products.find({ in_cart: true });
    if (cartItems.length > 0) {
      res.status(200).json({ cartItems: cartItems });
    } else {
      res.status(404).json({ message: "No items in wishlist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/product/reviews/:id", async (req, res) => {
  const { id } = req.params; // Product ID from the URL
  const { name, ratings, reviews, avatarPhoto } = req.body; // Review details from the request body

  if (!name || !ratings || !reviews || !avatarPhoto) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new review object
    const newReview = {
      name,
      ratings,
      reviews,
      avatarPhoto,
    };

    // Add the new review to the reviewsList array
    product.reviewsList.push(newReview);

    // Save the updated product
    await product.save();

    return res.status(200).json({
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/product/reviews/:id", async (req, res) => {
  const { id } = req.params; // Product ID from the URL

  try {
    const product = await Products.findById(id, "reviewsList"); // Fetch only the reviewsList field

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Reviews fetched successfully",
      reviewsList: product.reviewsList,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/orders", async (req, res) => {
  const {
    image,
    title,
    description,
    category,
    size,
    original_price,
    price,
    delivery_time,
    quantity,
  } = req.body;

  // Basic validation
  if (
    !image ||
    !title ||
    !original_price ||
    !price ||
    !delivery_time ||
    !description ||
    !category ||
    !size
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newOrder = new Order({
      image,
      title,
      description,
      category,
      size,
      original_price,
      price,
      delivery_time,
      quantity: quantity || 1,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Order
app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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

app.get("/productsearch", async (req, res) => {
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
