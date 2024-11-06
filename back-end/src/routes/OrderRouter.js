// src/routes/OrderRouter.js
import { Router } from "express";
import { checkout } from "../controllers/OrderControllers.js"; // Đảm bảo nhập đúng đường dẫn
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

router.post("/checkout", checkAuth, checkout);

export default router; // Export mặc định
