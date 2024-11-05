import { Router } from "express";
import {
  addToCart,
  getUserCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/CartControllers.js";
const cartRouter = Router();

// Thêm sản phẩm vào giỏ hàng
cartRouter.post("/add", addToCart);

// Lấy giỏ hàng của người dùng
cartRouter.get("/", getUserCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
cartRouter.put("/update", updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete("/remove", removeCartItem);

export default cartRouter;
