import React from "react";
import { useAuth } from "../../api/contexts/AuthContext"; // Đảm bảo đường dẫn đúng tới AuthContext
import "../css/Style.css";

const CustomerInfo: React.FC = () => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext

  return (
    <div className="info-section">
      <h2>Thông tin khách hàng</h2>
      <div className="customer-info">
        {user ? (
          <>
            <div className="customer-name">{user.fullName}</div>
            <div className="customer-contact">
              <span>SĐT: +84{user.phone}</span>
            </div>
            <div className="customer-address">
              <span>{user.address}</span>
              {/* Có thể thêm thông tin địa chỉ khác nếu cần */}
            </div>
          </>
        ) : (
          <div className="customer-name">Khách lẻ</div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;
