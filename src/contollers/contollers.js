const Order = require("../models/orders");
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

const getOrder = async () => {
  try {
    const orders = await Order.find();
    return orders;
  } catch (error) {
    throw error;
  }
};

const getReviewListById = async (id) => {
  try {
    const product = await Products.findById(id, "reviewsList");
    return product;
  } catch (error) {
    throw error;
  }
};

const addNewReview = async (product, newReview) => {
  try {
    product.reviewsList.push(newReview);

    await product.save();
  } catch (error) {
    throw error;
  }
};

const getProductInCart = async () => {
  try {
    const cartItems = await Products.find({ in_cart: true });
    return cartItems;
  } catch (error) {
    throw error;
  }
};

const getProductWished = async () => {
  try {
    const wishedProducts = await Products.find({ is_wished: true });
    return wishedProducts;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProductsByCategory,
  getAllProducts,
  getProductById,
  updateProductById,
  getSearchSuggestionByTitle,
  updateCartStatus,
  getReviewListById,
  getOrder,
  addNewReview,
  getProductInCart,
  getProductWished,
};
