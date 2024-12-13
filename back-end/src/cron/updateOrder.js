import cron from "node-cron";
import Order from "../models/OrderModels.js"; 
import moment from "moment";

export const updateDeliveredToSuccess = async () => {
  try {
    const twoDaysAgo = moment().subtract(2, "days").toDate();

    const ordersToUpdate = await Order.find({
      status: "Delivered",
      delivered_at: { $lte: twoDaysAgo },
    });

    if (ordersToUpdate.length === 0) {
      console.log("Không có đơn hàng cần cập nhật.");
      return;
    }

    await Promise.all(
      ordersToUpdate.map(async (order) => {
        order.status = "Success";
        await order.save();
        console.log(
          `Đã cập nhật trạng thái đơn hàng ${order._id} thành "Success"`
        );
      })
    );

    console.log("Cập nhật trạng thái thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
  }
};

cron.schedule("0 0 * * *", async () => {
  console.log("Bắt đầu cron job cập nhật trạng thái Delivered -> Success");
  await updateDeliveredToSuccess();
});
