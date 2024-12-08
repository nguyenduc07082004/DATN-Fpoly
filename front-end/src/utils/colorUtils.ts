// utils.ts
export const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Confirmed":
        return "blue";
      case "In Delivery":
        return "yellow";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "grey";
    }
  };
  
  export const getButtonClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "btn btn-sm btn-warning mx-1";
      case "Confirmed":
        return "btn btn-sm btn-primary mx-1"; 
      case "In Delivery":
        return "btn btn-sm btn-secondary mx-1"; 
      case "Delivered":
        return "btn btn-sm btn-success mx-1"; 
      case "Cancelled":
        return "btn btn-sm btn-danger mx-1"; 
      default:
        return "btn btn-sm btn-default mx-1"; 
    }
  };
  
  export const getPaymentStatusColor = (paymentStatus: string) => {
    return paymentStatus === "paid" ? "green" : "orange";
  };
  
  export const getPaymentStatusButtonClass = (status: string) => {
    return status === "paid"
      ? "btn btn-sm btn-success mx-1" 
      : "btn btn-sm btn-warning mx-1"; 
  };
  
type OrderStatus = "Pending" | "Confirmed" | "In delivery" | "Delivered" | "Cancelled";


export const orderStatusColors: Record<OrderStatus, string> = {
  "Pending": "text-warning",
  "Confirmed": "text-primary",
  "In delivery": "text-info",
  "Delivered": "text-success",
  "Cancelled": "text-danger",
};

export const getStatusText = (status:string) => {
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
      return "Đã huỷ";
    default:
      return "Không xác định";
  }
};