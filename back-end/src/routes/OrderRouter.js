import { Router } from "express";
import {
  checkout,
  getOrders,
  updateOrderStatus,
  getOrderByUserID,
  updatePaymentStatus,
  getOrderDetail
} from "../controllers/OrderControllers.js"; // Đảm bảo nhập đúng đường dẫn
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

// Route để tạo đơn hàng mới (checkout)
router.post("/checkout", checkAuth, checkout);

// Route để lấy chi tiết đơn hàng của người dùng đã xác thực
router.get("/", checkAuth, getOrders);
router.get("/:id", getOrderDetail);
router.get("/user/:id", checkAuth, getOrderByUserID);

// Route để cập nhật trạng thái đơn hàng
router.patch("/:orderId", checkAuth, updateOrderStatus);

router.patch("/payment/:orderId", checkAuth, updatePaymentStatus);

// router.patch("/:orderId", getOrderById);

export default router; // Export mặc định
