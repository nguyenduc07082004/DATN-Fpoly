import React, { useState } from "react";
import "../css/ShippingInfo.css";
import "../css/Style.css";

const ShippingInfo: React.FC = () => {
  const [category, setCategory] = useState<string>("");

  return (
    <div className="shipping-info">
      <div className="category-info">
        <label>Loại sản phẩm</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Chọn loại sản phẩm</option>
          <option value="phone">Điện thoại</option>
          <option value="accessory">Phụ kiện điện thoại</option>
        </select>
      </div>

      {category === "phone" && (
        <div className="phone-info">
          <label>Chọn hãng điện thoại</label>
          <select>
            <option value="apple">Apple</option>
            <option value="samsung">Samsung</option>
            <option value="xiaomi">Xiaomi</option>
            <option value="other">Khác</option>
          </select>
        </div>
      )}

      {category === "accessory" && (
        <div className="accessory-info">
          <label>Loại phụ kiện</label>
          <select>
            <option value="charger">Sạc</option>
            <option value="headphones">Tai nghe</option>
            <option value="case">Ốp lưng</option>
            <option value="screen-protector">Kính cường lực</option>
            <option value="other">Khác</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ShippingInfo; 