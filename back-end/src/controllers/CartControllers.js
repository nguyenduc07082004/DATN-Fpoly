import Product from "../models/ProductModels.js";
import Cart from "../models/CartModels.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, storage, color, price, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = new Cart({ user_id: userId, products: [], total_price: 0 });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString() && item.variantId === variantId
    );

    if (productIndex === -1) {
      cart.products.push({
        product: product._id,
        variantId,
        storage,    
        color,     
        price,     
        quantity, 
      });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    cart.total_price = cart.products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    await cart.save();

    return res.status(200).json({
      message: "Add to cart successfully",
      cart, 
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const getUserCart = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const userId = req.user._id; 
  try {
    const cart = await Cart.findOne({ user_id: userId })
      .populate("products.product")
      .populate("user_id"); 
  
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart); 
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Error getting cart", error });
  }
};





export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { variantId } = req.params; 

    if (!variantId) {
      return res.status(400).json({ message: "Variant ID is required" });
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.variantId.toString() === variantId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Variant not found in cart" });
    }

    const removedProduct = cart.products.splice(productIndex, 1)[0];

    cart.total_price -= removedProduct.price * removedProduct.quantity;

    await cart.save();

    res.status(200).json({
      message: "Variant removed from cart successfully",
      cart, 
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Error removing cart item", error });
  }
};




