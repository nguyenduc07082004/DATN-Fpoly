import React from "react";
// import "../css/CustomerInfo.css";
import "../css/Style.css";

const CustomerInfo: React.FC = () => {
  return (
    <div className="info-section">
      <h2>Thông tin khách hàng</h2>
      <div className="customer-info">
        <div className="customer-name">Khách lẻ</div>
        <div className="customer-contact">
          <span>SĐT: +840946896268</span>
        </div>
        <div className="customer-address">
          <span>Hội khuyến học tỉnh Ninh Bình</span>
          <span>Ngõ 750, đường Trần Hưng Đạo, thành phố Ninh Bình</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
