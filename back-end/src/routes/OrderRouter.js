import { Router } from "express";
import {
  checkout,
  getOrders,
  updateOrderStatus,
  getOrderByUserID,
  updatePaymentStatus,
  getOrderDetail,
  updateInfoOrder , 
  getTopSellingProducts , getProductVariantsDetails
} from "../controllers/OrderControllers.js"; // Đảm bảo nhập đúng đường dẫn
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

// Route để tạo đơn hàng mới (checkout)
router.post("/checkout", checkAuth, checkout);

// Route để lấy chi tiết đơn hàng của người dùng đã xác thực
router.get("/", checkAuth, getOrders);
router.get("/top-selling", getTopSellingProducts);
router.get("/product-variants/:productId", getProductVariantsDetails);
router.get("/user/:id", checkAuth, getOrderByUserID);
router.get("/order/:id", getOrderDetail);
// Route để cập nhật trạng thái đơn hàng
router.patch("/payment/:orderId", checkAuth, updatePaymentStatus);
router.patch("/:orderId", updateOrderStatus);
router.put("/:id", updateInfoOrder);


// router.patch("/:orderId", getOrderById);

export default router; // Export mặc định
