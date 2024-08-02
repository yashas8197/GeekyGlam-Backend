const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const app = express();
const cors = require("cors");

const Products = require("./models/products.model");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

initializeDatabase();

async function getAllProducts() {
  try {
    const allProducts = await Products.find();
    return allProducts;
  } catch (error) {
    throw error;
  }
}

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    if (products.length !== 0) {
      res.status(200).json({
        message: "fetched all Products successfully",
        product: products,
      });
    } else {
      res.status(404).json({ error: "Products not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch" });
  }
});

async function getProductById(productId) {
  try {
    const productById = await Products.findById(productId);
    return productById;
  } catch (error) {
    throw error;
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);
    if (product.length !== 0) {
      res.status(200).json({
        message: "fetched Product successfully",
        product: product,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server connected to port http://localhost:${PORT}`);
});
