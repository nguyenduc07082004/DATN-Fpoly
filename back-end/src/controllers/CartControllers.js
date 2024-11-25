import Product from "../models/ProductModels.js";
import Cart from "../models/CartModels.js";

// Add to cart
export const addToCart = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized. No valid user information found." });
    }

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // Tìm sản phẩm trong cơ sở dữ liệu
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra giỏ hàng của người dùng
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      // Nếu không có giỏ hàng, tạo giỏ hàng mới
      cart = new Cart({ user_id: userId, products: [], total_price: 0 });
    }

    // Kiểm tra sản phẩm có trong giỏ hàng chưa
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId.toString()
    );

    if (productIndex === -1) {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm vào giỏ
      cart.products.push({
        product: product, // Lưu toàn bộ thông tin sản phẩm
        quantity,
        price: product.price,
      });
    } else {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart.products[productIndex].quantity += quantity;
    }

    // Cập nhật lại tổng giá trị giỏ hàng
    cart.total_price = cart.products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Cập nhật thời gian thay đổi giỏ hàng
    cart.updated_at = Date.now();

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
  const userId = req.user._id; 
  try {
    const cart = await Cart.findOne({ user_id: userId })
      .populate("products.product")
      .populate("user_id"); 
  
      console.log(cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart); // Trả về cart đã được xử lý
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

    // Find the cart by user ID
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart's products array
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart's products array
    const removedProduct = cart.products.splice(productIndex, 1)[0];

    // Update the total price of the cart
    cart.total_price -= removedProduct.quantity * removedProduct.product.price;

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


