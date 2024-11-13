import Product from "../models/ProductModels.js";
import Cart from "../models/CartModels.js";

// Add to cart
export const addToCart = async (req, res, next) => {
  try {
    // Kiểm tra người dùng đã đăng nhập chưa
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No valid user information found." });
    }

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // Tìm sản phẩm trong cơ sở dữ liệu
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Nếu không có giỏ hàng thì tạo giỏ hàng mới
      cart = new Cart({ userId, products: [], totalPrice: 0 });
    }

    // Kiểm tra sản phẩm có trong giỏ hàng chưa
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (productIndex === -1) {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào giỏ
      cart.products.push({ product: productId, quantity });
    } else {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart.products[productIndex].quantity += quantity;
    }

    // Cập nhật lại tổng giá trị giỏ hàng
    cart.totalPrice = cart.products.reduce((total, item) => {
      const productPrice = product.price; // Cập nhật lại giá sản phẩm
      return total + productPrice * item.quantity;
    }, 0);

    // Lưu giỏ hàng vào cơ sở dữ liệu
    await cart.save();

    return res.status(200).json({
      message: "Add to cart successfully",
      cart, // Trả về giỏ hàng đã cập nhật
    });
  } catch (error) {
    next(error); // Đưa lỗi cho middleware xử lý
  }
};

// Get user cart
export const getUserCart = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const userId = req.user._id; // Assuming you have user authentication and req.user is set

  try {
    const cart = await Cart.findOne({ userId })
      .populate("products.product")
      .populate("userId");
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
