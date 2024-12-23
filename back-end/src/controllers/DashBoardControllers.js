import Comment from "../models/CommentsModels.js";
import Product from "../models/ProductModels.js";
import User from "../models/UserModels.js";
import Order from "../models/OrderModels.js";
import getMessage from "../utils/getMessage.js";
export const getDashboard = async (req, res) => {
  try {
    const {date} = req.query;
    const startDate = date ? new Date(date) : null;
    const endDate = startDate ? new Date(startDate) : null;
    if (startDate) endDate.setHours(23, 59, 59, 999); 

   
    const totalOrders = await Order.countDocuments(
      startDate
        ? { created_at: { $gte: startDate, $lte: endDate } }
        : {}
    );
    const totalProducts = await Product.countDocuments();
    const totalOrdersPending = await Order.countDocuments(
      startDate
        ? { 
            status: "Pending", 
            created_at: { $gte: startDate, $lte: endDate } 
          }
        : { status: "Pending" } // Nếu không có date, chỉ lọc theo status "Pending"
    );

    const totalOrdersUnpaid = await Order.countDocuments(startDate ? {
      payment_status: "unpaid",
      status: { $ne: "Cancelled" },
      created_at: { $gte: startDate, $lte: endDate },
    } : {
      payment_status: "unpaid",
      status: { $ne: "Cancelled" },
    });

    const totalRevenue = await Order.aggregate([
      {
        $match: {
          payment_status: "paid",
          ...(startDate ? { created_at: { $gte: startDate, $lte: endDate } } : {}),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_price" },
        },
      },
    ]);

    const salesData = await Order.aggregate([
      {
        $match: {
          payment_status: "paid",
          ...(startDate ? { created_at: { $gte: startDate, $lte: endDate } } : {}),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          totalSales: { $sum: "$total_price" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const totalOrderCancel = await Order.countDocuments({
      status: "Cancelled",
      ...(startDate ? { created_at: { $gte: startDate, $lte: endDate } } : {}),
    });
    const totalUser = await User.countDocuments();
    const totalUserOnline = await User.countDocuments({ is_active: true });
    const recentOrders = await Order.find({})
      .sort({ created_at: -1 })
      .limit(5)
      .populate({
        path: "items",
        populate: {
          path: "product variantId",
          select: "title description image variants",
        },
      })
      .exec(); 
      const products = await Product.aggregate([
        { $unwind: "$variants" }, 
        { $group: { 
            _id: { 
              productId: "$_id",  
              storage: "$variants.storage",
              color: "$variants.color",
              title: "$title"
            },
            totalStock: { $sum: "$variants.quantity" }  
          }
        },
        { $match: { totalStock: { $lt: 5 } } }  
      ]);
    res.status(200).json({
      total: {
        totalOrders,
        totalProducts,
        totalOrdersPending,
        totalOrdersUnpaid,
        totalRevenue,
        totalOrderCancel,
        totalUser,
        totalUserOnline,
      },
      products,
      recentOrders,
      salesData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
