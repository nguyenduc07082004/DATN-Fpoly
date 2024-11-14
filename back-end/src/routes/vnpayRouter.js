// src/routes/vnpayRouter.js
import express from 'express';
import crypto from 'crypto';
import querystring from 'querystring';

const router = express.Router();

// Lấy các thông số từ environment variables hoặc cấu hình
const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURNURL;

// Route Khởi Tạo Giao Dịch VNPay
router.get('/create_payment_url', (req, res) => {
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
    vnp_Amount: amount * 100, // VNPay yêu cầu số tiền phải là đơn vị đồng
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
router.get('/vnpay_return', (req, res) => {
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

export default router;
