import { Router } from "express";
const CategoryRouter = Router();
import {
  getCategory,
  addCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryControllers.js";

import multer from "multer";
// Lấy danh sách sản phẩm (không cần xác thực)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// Lấy danh sách sản phẩm
CategoryRouter.get("/", getCategory);
CategoryRouter.get(
  "/:id", //authMiddleware,
  getCategoryById
);

// Thêm sản phẩm
CategoryRouter.post(
  "/add", upload.single("image"),
  addCategory
);

CategoryRouter.get(
  "/:id", //authMiddleware,
  getCategoryById
);

// Cập nhật sản phẩm
CategoryRouter.put(
  "/edit/:id", upload.single("image"),
  updateCategory
);

// Xóa sản phẩm
CategoryRouter.delete(
  "/:id", //authMiddleware,
  deleteCategory
);

export default CategoryRouter;
