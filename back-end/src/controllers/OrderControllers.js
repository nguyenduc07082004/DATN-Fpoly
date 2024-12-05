import Order from "../models/OrderModels.js";
import Cart from "../models/CartModels.js";
import Product from "../models/ProductModels.js";
import OrderItem from "../models/OrderItemModels.js";
import Invoice from "../models/InvoiceModels.js";
import Voucher from "../models/VoucherModels.js";
import {io } from "../../index.js"
export const checkout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user_id: userId })
      .populate("products.product")
      .populate("user_id");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không tồn tại hoặc giỏ hàng trống" });
    }

    // Check stock availability
    for (const item of cart.products) {
      const product = item.product;
      const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
      if (variant && variant.quantity < item.quantity) {
        return res.status(400).json({
          message: `Không đủ số lượng cho sản phẩm ${product.title} (Màu sắc: ${variant.color}). Số lượng tồn kho: ${variant.quantity}`,
        });
      }
    }
    let totalPrice = cart.products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    
    
    if (req.body.discountCode.discountCode) {
      const discount = await Voucher.findOne({ code: req.body.discountCode.discountCode });
    
      if (discount) {
        console.log("Voucher found:", discount);
    
        const discountPercent = Number(discount.discount); // Đảm bảo discount.discount là số
        const value = (Number(totalPrice) * discountPercent) / 100;
    
        totalPrice = totalPrice - value;
      } else {
        console.log("Voucher not found or invalid");
      }
    }
    
    // Create the order
    const order = new Order({
      user_id: userId,
      status: "Pending",
      total_price: totalPrice,
      receiver_name: cart.user_id.first_name + " " + cart.user_id.last_name,
      receiver_phone: cart.user_id.phone,
      receiver_address: cart.user_id.address,
      payment_status: "unpaid",
      voucher: req.body.discountCode.discountCode,
      discount_value: cart.total_price - totalPrice
    });

    const savedOrder = await order.save();

    await Voucher.findOneAndUpdate(
      { code: req.body.discountCode.discountCode },
      { is_used: true },
      { user_id: userId }
    )
   
    // Create order items
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

    // Update stock for each product variant
    for (const item of cart.products) {
      const product = item.product;

      for (const variant of product.variants) {
        if (variant._id.toString() === item.variantId.toString()) {
          variant.quantity -= item.quantity;
          break;
        }
      }

      await product.save(); 
    }

    // Clear the cart
    await Cart.findOneAndDelete({ user_id: userId });

    // Notify the user via socket
    io.emit("orderCreated", {
      message: `Bạn có đơn hàng mới vừa tạo`,
      orderId: savedOrder._id,
    });

    // Return success response with order information
    res.status(201).json({
      message: "Đặt hàng thành công",
      order: savedOrder,
    });
  } catch (error) {
    next(error);
  }
};





export const getOrders = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    const order = await Order.find()
      .populate({
        path: "items", 
        populate: { 
          path: "product variantId", 
          select: "title description image"
        }
      }).sort({created_at:-1})
      .exec();

    if (!order || order.length === 0) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ message: "Error getting order details", error });
  }
};

export const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate({
        path: "items",
        populate: {
          path: "product variantId",
          select: "title description image variants",
        },
      })
      .exec();
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.log(error)
  }

}

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "Pending",
    "In Delivery",
    "Confirmed",
    "Delivered",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Trạng thái không hợp lệ",
      validStatuses,
    });
  }

  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "items",
        populate: {
          path: "product variantId",
          select: "title description image variants",
        },
      })
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    if (!Array.isArray(order.items)) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm trong đơn hàng không hợp lệ" });
    }

    // Kiểm tra trạng thái cũ của đơn hàng
    const currentStatus = order.status;

    // Kiểm tra xem trạng thái có thay đổi không
    if (currentStatus === status) {
      return res.status(400).json({
        message: `Trạng thái đơn hàng đã là "${status}", không cần thay đổi`,
      });
    }

    const allowedTransitions = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["In Delivery", "Cancelled"],
      "In Delivery": ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };

    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Không thể chuyển trạng thái từ "${currentStatus}" sang "${status}"`,
      });
    }

    // Xử lý các trạng thái đặc biệt
    if (status === "Cancelled" && currentStatus !== "Cancelled") {
      const updateVariantsPromises = order.items.map(async (item) => {
        const product = await Product.findById(item.product._id);
        if (!product) {
          throw new Error(
            `Không tìm thấy sản phẩm với ID ${item.product._id}`
          );
        }
        const variant = product.variants.find(
          (variant) =>
            variant._id.toString() === item.variantId.toString()
        );

        if (!variant) {
          throw new Error(
            `Không tìm thấy variant với ID ${item.variantId} trong sản phẩm ${product.name}`
          );
        }

        variant.quantity += item.quantity;

        await product.save();
      });

      await Promise.all(updateVariantsPromises);
    }

    if (status === "Delivered" && order.payment_status !== "paid") {
      order.payment_status = "paid"; 
    }

    if (status === "Delivered") {
      const invoice = new Invoice({
        userId: order.user_id,
        orderId: order._id,
        orderItems: order.items.map(item => ({
          productId: item.product._id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          storage: item.storage,
          color: item.color
        })),
        totalAmount: order.total_price
      });

      await invoice.save();
    }

    // Cập nhật trạng thái đơn hàng
    order.status = status;
    await order.save();

    // Phát sự kiện qua Socket.io chỉ khi trạng thái thực sự thay đổi
    // Giả sử bạn đã lưu trạng thái cũ trong bộ nhớ (ví dụ: `previousStatuses`)
    if (io && io.emit) {
      io.emit("orderStatusUpdated", {
        message: `Trạng thái đơn hàng ${orderId} đã thay đổi từ "${currentStatus}" thành "${status}"`,
        orderId: orderId,
        status: status,
        userId: req.user._id
      });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Error updating order status",
      error: error.message,
    });
  }
};



export const updatePaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { payment_status } = req.body; 

  const validStatuses = ["unpaid", "paid"];

  if (!validStatuses.includes(payment_status)) {
    return res.status(400).json({
      message: "Trạng thái không hợp lệ",
      validStatuses,
    });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    order.payment_status = payment_status;
    await order.save();

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};

export const getOrderByUserID = async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 5; 

  try {
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user_id: userId })
      .sort({ created_at: -1 }) // Sort by created_at in descending order (latest first)
      .skip(skip) 
      .limit(limit)
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "title description variants",
        },
      });

    const totalOrders = await Order.countDocuments({ user_id: userId });

    const totalPages = Math.ceil(totalOrders / limit); 

    if (!orders.length) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json({
      orders,
      totalPages,
      currentPage: page,
      totalOrders,
    });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ message: "Error getting order details", error });
  }
};

export const updateInfoOrder = async (req, res) => {
  const { id } = req.params;
  const { receiver_address , receiver_name, receiver_phone } = req.body;

  try {
    const order = await Order.findById(id); 
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    order.receiver_address = receiver_address;
    order.receiver_name = receiver_name;
    order.receiver_phone = receiver_phone;
    await order.save();

    res.status(200).json({
      message: "Cập nhật thống tin đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Error updating order info:", error);
    res.status(500).json({ message: "Error updating order info", error });
  }
};
