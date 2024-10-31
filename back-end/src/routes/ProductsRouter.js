const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductControllers");
const multer = require("multer");
// Lấy danh sách sản phẩm (không cần xác thực)
router.get("/", productController.getProducts);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get(
  "/:id", //authMiddleware,
  productController.getProductById
);
router.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.status(200).json({ success: true, file: req.file });
});

// Thêm sản phẩm (yêu cầu xác thực)
router.post(
  "/add", //authMiddleware,
  upload.single("image"),
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
