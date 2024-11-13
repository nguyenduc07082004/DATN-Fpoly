import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import querystring from "querystring";
import cors from "cors";
import authRouter from "./src/services/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/DUAN";
const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURNURL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối đến MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((error) => console.error("Lỗi kết nối MongoDB:", error));

// Route Khởi Tạo Giao Dịch VNPay
app.get("/create_payment_url", (req, res) => {
  const date = new Date();
  const orderId = date.getTime();
  const amount = req.query.amount;
  const bankCode = req.query.bankCode || "";

  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toan don hang",
    vnp_OrderType: "billpayment",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    vnp_CreateDate: date.toISOString().replace(/[-:]/g, "").slice(0, 14),
  };

  if (bankCode) {
    params.vnp_BankCode = bankCode;
  }

  const sortedParams = Object.fromEntries(Object.entries(params).sort());
  const signData = querystring.stringify(sortedParams, { encodeURIComponent: (str) => str });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signature = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  sortedParams.vnp_SecureHash = signature;
  const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedParams)}`;
  res.redirect(paymentUrl);
});

// Route Xử Lý Sau Khi Thanh Toán
app.get("/vnpay_return", (req, res) => {
  const vnpParams = req.query;
  const secureHash = vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHash;

  const sortedParams = Object.fromEntries(Object.entries(vnpParams).sort());
  const signData = querystring.stringify(sortedParams, { encodeURIComponent: (str) => str });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (vnpParams.vnp_ResponseCode === "00") {
      res.send("Giao dịch thành công!");
    } else {
      res.send("Giao dịch thất bại!");
    }
  } else {
    res.send("Chữ ký không hợp lệ!");
  }
});

// Các route khác
app.use("/", authRouter);
app.use("/images", express.static("uploads"));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
