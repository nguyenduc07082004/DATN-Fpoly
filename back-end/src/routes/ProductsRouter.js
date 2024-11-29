import { Router } from "express";
const ProductRouter = Router();
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createVariant,
  getProductsWithoutVariants,
  getFilteredProducts
} from "../controllers/ProductControllers.js";
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

ProductRouter.post("/add", upload.single("image"), addProduct);
ProductRouter.get("/", getProducts);
ProductRouter.get("/without-variants", getProductsWithoutVariants);
ProductRouter.get("/filters", getFilteredProducts);
ProductRouter.get(
  "/:id", //authMiddleware,
  getProductById
);

ProductRouter.post(
  "/create/variants", 
  upload.array("images", 10), 
  createVariant
);

// Cập nhật sản phẩm (yêu cầu xác thực)
ProductRouter.put(
  "/edit/:id",
  upload.single("image"), //authMiddleware,
  updateProduct
);

// Xóa sản phẩm (yêu cầu xác thực)
ProductRouter.delete(
  "/:id", //authMiddleware,
  deleteProduct
);



export default ProductRouter;
