import React from "react";
import { useNavigate } from "react-router-dom";

const VnpayPayment = () => {
  const navigate = useNavigate();

  const handleCompletePayment = () => {
    alert("Thanh toán qua vnpay thành công!");
    navigate("/product-page"); // Quay lại trang sản phẩm sau khi thanh toán xong
  };

  return (
    <div>
      <h1>Thanh toán qua vnpay</h1>
      <p>Đang xử lý thanh toán...</p>
      {/* Giả lập nút hoàn tất thanh toán */}
      <button onClick={handleCompletePayment} className="btn btn-primary">
        Hoàn tất thanh toán
      </button>
    </div>
  );
};

export default VnpayPayment;
