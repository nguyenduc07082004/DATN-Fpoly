import { Router } from "express";
import {
  addToCart,
  getUserCart,
  removeCartItem,
} from "../controllers/CartControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkAuth } from "../middleware/checkAuth.js";

const cartRouter = Router();

// Thêm sản phẩm vào giỏ hàng
cartRouter.post("/add", addToCart);

// Lấy giỏ hàng của người dùng
cartRouter.get("/", getUserCart);

// Xóa sản phẩm khỏi giỏ hàng
cartRouter.delete(`/remove/:variantId`, removeCartItem);

export default cartRouter;


