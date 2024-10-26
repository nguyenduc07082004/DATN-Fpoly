const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductControllers");
const authMiddleware = require("../middleware/authmiddleware");
// Lấy danh sách sản phẩm (không cần xác thực)
router.get("/", productController.getProducts);

router.get("/:id", //authMiddleware,
 productController.getProductById);

// Thêm sản phẩm (yêu cầu xác thực)
router.post(
  "/add", //authMiddleware,
  productController.addProduct
);

router.get(
  "/:id", //authMiddleware,
  productController.getProductById
);

// Cập nhật sản phẩm (yêu cầu xác thực)
router.put(
  "/edit/:id", //authMiddleware,
  productController.updateProduct
);

// Xóa sản phẩm (yêu cầu xác thực)
router.delete(
  "/:id", //authMiddleware,
  productController.deleteProduct
);

module.exports = router;
