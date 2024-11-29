import Product from "../models/ProductModels.js";
import Cart from "../models/CartModels.js";
import getMessage from "../utils/getMessage.js";
export const addToCart = async (req, res) => {
  const lang = req.lang;
  try {
    const { productId, variantId, storage, color, price, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: getMessage(lang, 'error', 'PRODUCT_NOT_FOUND') || "Sản phẩm không tồn tại",
      });
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
      message: getMessage(lang, 'success', 'ADD_TO_CART_SUCCESS') || "Thêm vào giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: getMessage(lang, 'error', 'ADD_TO_CART_FAIL') || "Lỗi khi thêm vào giỏ hàng",
    });
  }
};

export const getUserCart = async (req, res) => {
  const lang = req.lang;
  if (!req.user) {
    return res.status(401).json({
      message: getMessage(lang, 'error', 'USER_NOT_AUTHENTICATED') || "Người dùng chưa xác thực",
    });
  }
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user_id: userId })
      .populate("products.product")
      .populate("user_id");

    if (!cart) {
      return res.status(404).json({
        message: getMessage(lang, 'error', 'CART_NOT_FOUND') || "Không tìm thấy giỏ hàng",
      });
    }

    res.status(200).json({
      message: getMessage(lang, 'success', 'GET_CART_SUCCESS') || "Lấy giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      message: getMessage(lang, 'error', 'GET_CART_FAIL') || "Lỗi khi lấy giỏ hàng",
      error,
    });
  }
};

export const removeCartItem = async (req, res) => {
  const lang = req.lang;
  try {
    const userId = req.user._id;
    const { variantId } = req.params;

    if (!variantId) {
      return res.status(400).json({
        message: getMessage(lang, 'error', 'VARIANT_ID_REQUIRED') || "Yêu cầu ID biến thể",
      });
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({
        message: getMessage(lang, 'error', 'CART_NOT_FOUND') || "Không tìm thấy giỏ hàng",
      });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.variantId.toString() === variantId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: getMessage(lang, 'error', 'VARIANT_NOT_FOUND_IN_CART') || "Không tìm thấy biến thể trong giỏ hàng",
      });
    }

    const removedProduct = cart.products.splice(productIndex, 1)[0];

    cart.total_price -= removedProduct.price * removedProduct.quantity;

    await cart.save();

    res.status(200).json({
      message: getMessage(lang, 'success', 'REMOVE_CART_ITEM_SUCCESS') || "Xóa biến thể khỏi giỏ hàng thành công",
      cart,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      message: getMessage(lang, 'error', 'REMOVE_CART_ITEM_FAIL') || "Lỗi khi xóa biến thể khỏi giỏ hàng",
      error,
    });
  }
};
