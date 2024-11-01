const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductControllers");
const multer = require("multer");
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

router.post("/add", upload.single("image"), productController.addProduct);
router.get("/", productController.getProducts);

router.get(
  "/:id", //authMiddleware,
  productController.getProductById
);

// Thêm sản phẩm (yêu cầu xác thực)

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
