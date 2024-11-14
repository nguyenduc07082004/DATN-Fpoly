// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./src/services/auth.js";
import vnpayRouter from "./src/routes/vnpayRouter.js"; // Import vnpayRouter

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/DUAN";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((error) => console.error("Lỗi kết nối MongoDB:", error));

// Sử dụng các router
app.use("/", authRouter);
app.use("/vnpay", vnpayRouter); // Đảm bảo bạn đang sử dụng đúng route cho VNPay

// Các route khác
app.use("/images", express.static("uploads"));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
