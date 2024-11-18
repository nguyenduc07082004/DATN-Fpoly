import { Router } from "express";
const router = Router();
import moment from "moment";
import querystring from "qs";
import crypto from "crypto";
import CartModels from "../models/CartModels.js";
import OrderModels from "../models/OrderModels.js";

const vnp_TmnCode = "1FDEBV99"; // Replace with your VNPay TmnCode
const vnp_HashSecret = "HMD09FSOL18IL59STWAMEX0ZOIU4HENY"; // Replace with your VNPay HashSecret
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // VNPay URL
const vnp_ReturnUrl = "http://localhost:5173/checkout";

router.post("/create_payment_url", async function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = vnp_TmnCode;
  let secretKey = vnp_HashSecret;
  let vnpUrl = vnp_Url;
  let returnUrl = vnp_ReturnUrl;

  let orderId = moment(date).format("DDHHmmss");
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });

  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  res.status(200).json({ code: "00", data: vnpUrl });
});

router.get("/vnpay_return", async function (req, res, next) {
  // let vnp_Params = req.query;

  // let secureHash = vnp_Params["vnp_SecureHash"];

  // delete vnp_Params["vnp_SecureHash"];
  // delete vnp_Params["vnp_SecureHashType"];

  // vnp_Params = sortObject(vnp_Params);

  // let tmnCode = vnp_TmnCode;
  // let secretKey = vnp_HashSecret;

  // let signData = querystring.stringify(vnp_Params, { encode: false });

  // let hmac = crypto.createHmac("sha512", secretKey);
  // let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  // if (secureHash === signed) {
  //   //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

  //   res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  // } else {
  //   res.render("success", { code: "97" });
  // }
  try {
    const userId = req.user._id; // Lấy thông tin người dùng từ token
    const cart = await CartModels.findOne({ userId }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(400).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Tính tổng giá trị của đơn hàng
    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Tạo đơn hàng mới
    const order = new OrderModels({
      userId,
      products: cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
      status: "Pending", // Trạng thái mặc định khi đơn hàng mới được tạo
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();

    // Xóa giỏ hàng sau khi thanh toán
    await CartModels.findOneAndDelete({ userId });

    res.status(201).json({
      message: "Đặt hàng thành công",
      order,
    });
  } catch (error) {
    next(error);
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default router;
