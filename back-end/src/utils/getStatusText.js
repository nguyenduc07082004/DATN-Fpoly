export const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xác nhận";
      case "Confirmed":
        return "Xác nhận";
      case "In Delivery":
        return "Vận chuyển";
      case "Delivered":
        return "Hoàn thành đơn hàng";
      case "Cancelled":
        return "Huỷ";
      default:
        return "Không xác định";
    }
  };