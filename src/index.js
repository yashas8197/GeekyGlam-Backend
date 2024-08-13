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
