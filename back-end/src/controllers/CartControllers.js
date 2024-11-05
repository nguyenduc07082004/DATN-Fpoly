import Product from "../models/ProductModels.js";
import Cart from "../models/CartModels.js";

// Add to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Nếu người dùng chưa có cart thì tạo cart, nếu có rồi thì thêm vào cart.

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, products: [], totalPrice: 0 });

    console.log(cart);
    const productIndex = cart.products.findIndex(
      (item) => item.product == productId
    );
    if (productIndex === -1) {
      // Nếu sản phẩm chưa có trong cart.products thì push sản phẩm vào cart.product kèm theo quantity
      cart.products.push({ product: productId, quantity });
    } else {
      // Nếu sản phẩm đã có trong giỏ hàng rồi mà ấn mua thêm thì cập nhật lại quantity
      console.log(cart);
      cart.products[productIndex].quantity += quantity;
    }
    cart.totalPrice += product.price * quantity;
    console.log(cart);
    await cart.save();
    return res.status(200).json({
      message: "Add to cart successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// Get user cart
export const getUserCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("products.product");
    return res.json({
      message: "Get cart successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Assuming you have user authentication and req.user is set

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productExists = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    productExists.quantity = quantity;
    cart.totalPrice = cart.products.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

// Remove cart item
export const removeCartItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; // Assuming you have user authentication and req.user is set

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);
    cart.totalPrice = cart.products.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Error removing cart item", error });
  }
};
