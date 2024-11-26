import { Router } from "express";
const CategoryRouter = Router();
import {
  getCategory,
  addCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryControllers.js";

// Lấy danh sách sản phẩm
CategoryRouter.get("/", getCategory);
CategoryRouter.get(
  "/:id", //authMiddleware,
  getCategoryById
);

// Thêm sản phẩm
CategoryRouter.post(
  "/add", //authMiddleware,
  addCategory
);

CategoryRouter.get(
  "/:id", //authMiddleware,
  getCategoryById
);

// Cập nhật sản phẩm
CategoryRouter.put(
  "/edit/:id", //authMiddleware,
  updateCategory
);

// Xóa sản phẩm
CategoryRouter.delete(
  "/:id", //authMiddleware,
  deleteCategory
);

export default CategoryRouter;
