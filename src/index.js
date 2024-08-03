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
      res.status(404).json({ message: "No Products Found" });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
