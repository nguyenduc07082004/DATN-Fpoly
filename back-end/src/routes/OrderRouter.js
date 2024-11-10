import { Router } from "express";
import { checkout, getOrderDetail, updateOrderStatus } from "../controllers/OrderControllers.js"; // Đảm bảo nhập đúng đường dẫn
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

// Route để tạo đơn hàng mới (checkout)
router.post("/checkout", checkAuth, checkout);

// Route để lấy chi tiết đơn hàng của người dùng đã xác thực
router.get("/", checkAuth, getOrderDetail);

// Route để cập nhật trạng thái đơn hàng
router.put("/:orderId/status", checkAuth, updateOrderStatus);

export default router; // Export mặc định
