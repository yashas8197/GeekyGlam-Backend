const Products = require("../models/products.model");

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

async function getProductById(productId) {
  try {
    const product = await Products.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
}

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

const updateCartStatus = async () => {
  try {
    const products = await Products.find(); // Assuming Product is your product model

    for (let product of products) {
      product.in_cart = false;
      await product.save();
    }

    return products;
  } catch (error) {
    throw new Error("Error updating cart status.");
  }
};

module.exports = {
  getProductsByCategory,
  getAllProducts,
  getProductById,
  updateProductById,
  getSearchSuggestionByTitle,
  updateCartStatus,
};
