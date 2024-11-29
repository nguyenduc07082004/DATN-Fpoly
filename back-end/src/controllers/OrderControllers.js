import Order from "../models/OrderModels.js";
import Cart from "../models/CartModels.js";
import Product from "../models/ProductModels.js";
import OrderItem from "../models/OrderItemModels.js";

export const checkout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user_id: userId }).populate("products.product").populate("user_id");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không tồn tại hoặc giỏ hàng trống" });
    }

    const checkStockPromises = cart.products.map(async (item) => {
      const product = item.product;

      const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());

      if (variant) {
        if (variant.quantity < item.quantity) {
          throw new Error(`Không đủ số lượng cho sản phẩm ${product.name} (Màu sắc: ${variant.color}). Số lượng tồn kho: ${variant.quantity}`);
        }
      }
    });

    await Promise.all(checkStockPromises);

    const totalPrice = cart.products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const order = new Order({
      user_id: userId,
      status: "Pending",
      total_price: totalPrice,
      receiver_name: cart.user_id.first_name + " " + cart.user_id.last_name,
      receiver_phone: cart.user_id.phone,
      receiver_address: cart.user_id.address,
      payment_status: "unpaid", 
    });

    const savedOrder = await order.save();

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

    const updateVariantsPromises = cart.products.map(async (item) => {
      const product = item.product;
      
      product.variants.forEach((variant) => {
        if (variant._id.toString() === item.variantId.toString()) {
          variant.quantity -= item.quantity;
        }
      });

      await product.save();
    });

    await Promise.all(updateVariantsPromises);

    await Cart.findOneAndDelete({ user_id: userId });

    res.status(201).json({
      message: "Đặt hàng thành công",
      order: savedOrder,
    });
  } catch (error) {
    next(error);
  }
};


export const getOrderDetail = async (req, res) => {
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
      })
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


export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "In Delivery", "Delivered", "Cancelled"];

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
      return res.status(400).json({ message: "Danh sách sản phẩm trong đơn hàng không hợp lệ" });
    }


    // Kiểm tra nếu trạng thái chuyển sang "Cancelled"
    if (status === "Cancelled" && order.status !== "Cancelled") {
      const updateVariantsPromises = order.items.map(async (item) => {
        const product = await Product.findById(item.product._id); 

        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm với ID ${item.product._id}`);
        }

        const variant = product.variants.find(
          (variant) => variant._id.toString() === item.variantId.toString()
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

    // Kiểm tra nếu trạng thái chuyển sang "Delivered" và payment_status chưa phải là "paid"
    if (status === "Delivered" && order.payment_status !== "paid") {
      order.payment_status = "paid"; // Cập nhật payment_status thành "paid"
    }

    order.status = status; // Cập nhật trạng thái đơn hàng
    await order.save();

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error: error.message });
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
  try {
    const order = await Order.find({ userId }).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ message: "Error getting order details", error });
  }
};
