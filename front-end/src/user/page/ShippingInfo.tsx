import React, { useState } from "react";
// import "../css/ShippingInfo.css";
import "../css/Style.css";

const ShippingInfo: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const cityDistrictMap: { [key: string]: string[] } = {
    "Hà Nội": ["Hồ Tây", "Mỹ Đình", "Cầu Giấy"],
    "Hồ Chí Minh": ["Quận 1", "Quận 3", "Bình Thạnh", "Thủ Đức"],
  };

  return (
    <div className="shipping-info">
      <div className="category-info">
        <label>Thành phố</label>
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setDistrict(""); // Reset district when city changes
          }}
        >
          <option value="">Chọn Thành phố</option>
          <option value="Hà Nội">Hà Nội</option>    
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>        
        </select>
      </div>

      {city && (
        <div className="district-info">
          <label>Tỉnh Thành/Quận Huyện</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">Chọn Quận/Huyện</option>
            {cityDistrictMap[city]?.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ShippingInfo;
