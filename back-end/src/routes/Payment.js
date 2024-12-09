import { Router } from "express";
const router = Router();
import moment from "moment";
import querystring from "qs";
import crypto from "crypto";
import Cart from "../models/CartModels.js";
import Order from "../models/OrderModels.js";
import OrderItem from "../models/OrderItemModels.js";
import Voucher from "../models/VoucherModels.js";
import {io } from "../../index.js"
const vnp_TmnCode = "1FDEBV99"; // Replace with your VNPay TmnCode
const vnp_HashSecret = "HMD09FSOL18IL59STWAMEX0ZOIU4HENY"; // Replace with your VNPay HashSecret
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // VNPay URL
const vnp_ReturnUrl = "http://localhost:8000/vnpay/vnpay_return";

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
  let userId = req.body.userId;
  let discountCode = req.body.discountCode;
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
  vnp_Params["vnp_OrderInfo"] = `${userId}|${discountCode}`;
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

  // Return the payment URL to initiate payment
  res.status(200).json({ code: "00", data: vnpUrl });

  // Process the cart and order only after the payment is successful (on VNPay's return)
  // You will need to handle this in a separate route, where VNPay returns the payment result
});

router.get("/vnpay_return", async function (req, res, next) {
  var vnp_Params = req.query;
  const vnp_OrderInfo = vnp_Params["vnp_OrderInfo"];
  const [userId, discountCode] = vnp_OrderInfo.split("|"); // Tách userId và discountCode

  var secureHash = vnp_Params["vnp_SecureHash"];
  const responseCode = vnp_Params["vnp_ResponseCode"]; // Lấy mã phản hồi từ VNPAY

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  var tmnCode = vnp_TmnCode;
  var secretKey = vnp_HashSecret;

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    // Kiểm tra nếu mã phản hồi là "00" (thành công)
    if (responseCode === "00") {
      try {
        const user_id = userId;

        // Lấy giỏ hàng của người dùng
        const cart = await Cart.findOne({ user_id: user_id })
          .populate("products.product")
          .populate("user_id");

        if (!cart || cart.products.length === 0) {
          return res
            .status(400)
            .json({ message: "Giỏ hàng không tồn tại hoặc giỏ hàng trống." });
        }

        // Kiểm tra số lượng sản phẩm trong kho
        const checkStockPromises = cart.products.map(async (item) => {
          const product = item.product;
          const variant = product.variants.find(
            (v) => v._id.toString() === item.variantId.toString()
          );

          if (variant && variant.quantity < item.quantity) {
            throw new Error(
              `Không đủ số lượng cho sản phẩm ${product.name} (Màu sắc: ${variant.color}). Số lượng tồn kho: ${variant.quantity}`
            );
          }
        });

        await Promise.all(checkStockPromises);

        // Tính tổng giá trị giỏ hàng
        let totalPrice = cart.products.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        if (discountCode) {
          const discount = await Voucher.findOne({ code: discountCode });
          if (discount) {
            const discountPercent = Number(discount.discount); 
            const minOrderValue = Number(discount.min_order_value); 
            const maxDiscountAmount = Number(discount.max_discount_amount); 
            if (totalPrice >= minOrderValue) {
              let discountValue = (totalPrice * discountPercent) / 100;
        
              if (discountValue > maxDiscountAmount) {
                console.log(`Discount exceeds maximum limit, applying max discount of ${maxDiscountAmount}`);
                discountValue = maxDiscountAmount; 
              } else {
                console.log(`Applying discount: ${discountValue}`);
              }
              totalPrice -= discountValue;
            } else {
              console.log(`Total price is less than minimum order value: ${minOrderValue}`);
            }
          } else {
            console.log("Voucher not found or invalid");
          }
        }

        // Tạo một đơn hàng mới
        const order = new Order({
          user_id: user_id,
          status: "Pending",
          total_price: totalPrice,
          receiver_name: `${cart.user_id.first_name} ${cart.user_id.last_name}`,
          receiver_phone: cart.user_id.phone,
          receiver_address: cart.user_id.address,
          payment_status: "paid",
          voucher: discountCode,
          discount_value:
            cart.products.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            ) - totalPrice,
        });

        const savedOrder = await order.save();

        await Voucher.findOneAndUpdate(
          { code: discountCode },
          { is_used: true }
        );

        const orderItems = cart.products.map((item) => ({
          order_id: savedOrder._id,
          product: item.product._id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          storage: item.storage,
          color: item.color,
        }));

        const savedOrderItems = await OrderItem.insertMany(orderItems);

        savedOrder.items = savedOrderItems.map((item) => item._id);
        await savedOrder.save();

        for (const item of cart.products) {
          const product = item.product;
          const variant = product.variants.find(
            (variant) => variant._id.toString() === item.variantId.toString()
          );
          if (variant) {
            variant.quantity -= item.quantity;
            await product.save();
          }
        }

        await Cart.findOneAndDelete({ user_id: userId });
        io.emit("orderCreated", {
          message: `Bạn có đơn hàng mới vừa tạo`,
          orderId: savedOrder._id,
        });

        res.redirect("http://localhost:5173/checkout");
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else {
      res.redirect("http://localhost:5173/cart");
    }
  } else {
    res.json({ code: "97" });
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
