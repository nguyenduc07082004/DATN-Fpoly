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
  const userId = req.user._id; // Assuming you have user authentication and req.user is set

  try {
    const cart = await Cart.findOne({ userId }).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Error getting cart", error });
  }
};

// Remove cart item
export const removeCartItem = async (req, res) => {
  // try {
  //   const userId = req.user._id; // Assuming you have user authentication and req.user is set
  //   const { productId } = req.body;

  //   // Ensure productId is provided
  //   if (!productId) {
  //     return res.status(400).json({ message: "Product ID is required" });
  //   }

  //   // Find the cart by user ID
  //   const cart = await Cart.findOne({ userId });
  //   if (!cart) {
  //     return res.status(404).json({ message: "Cart not found" });
  //   }

  //   // Log the product IDs for debugging
  //   console.log("Product ID to remove:", productId);
  //   console.log(
  //     "Product IDs in cart:",
  //     cart.products.map((item) => item.product.toString())
  //   );

  //   // Find the product in the cart's products array
  //   const productIndex = cart.products.findIndex(
  //     (item) => item.product.toString() === productId
  //   );
  //   if (productIndex === -1) {
  //     return res.status(404).json({ message: "Product not found in cart" });
  //   }

  //   // Remove the product from the cart's products array
  //   const removedProduct = cart.products.splice(productIndex, 1)[0];

  //   // Ensure removedProduct.product.price is defined
  //   if (!removedProduct.product.price) {
  //     return res.status(500).json({ message: "Product price is not defined" });
  //   }

  //   // Log the removed product and its price for debugging
  //   console.log("Removed product:", removedProduct);
  //   console.log("Removed product price:", removedProduct.product.price);

  //   // Update the total price of the cart
  //   cart.totalPrice -= removedProduct.quantity * removedProduct.product.price;

  //   // Save the updated cart
  //   await cart.save();

  //   res.status(200).json({
  //     message: "Product removed from cart successfully",
  //     cart,
  //   });
  // } catch (error) {
  //   console.error("Error removing cart item:", error);
  //   res.status(500).json({ message: "Error removing cart item", error });
  // }
  try {
    const userId = req.user._id; // Assuming you have user authentication and req.user is set
    const { productId } = req.body;

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the cart by user ID and populate the product details
    const cart = await Cart.findOne({ userId }).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Log the product IDs for debugging
    console.log("Product ID to remove:", productId);
    console.log(
      "Product IDs in cart:",
      cart.products.map((item) => item.product.toString())
    );

    // Find the product in the cart's products array
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart's products array
    const removedProduct = cart.products.splice(productIndex, 1)[0];

    // Ensure removedProduct.product.price is defined
    if (!removedProduct.product.price) {
      return res.status(500).json({ message: "Product price is not defined" });
    }

    // Log the removed product and its price for debugging
    console.log("Removed product:", removedProduct);
    console.log("Removed product price:", removedProduct.product.price);

    // Update the total price of the cart
    cart.totalPrice -= removedProduct.quantity * removedProduct.product.price;

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Error removing cart item", error });
  }
};
