import React, { useContext, useEffect } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import { CartItem } from "../../api/reducers/OrderReducer";

const QLDH = () => {
  const { state, getOrder } = useContext(OrderContext) as OrderContextType;

  useEffect(() => {
    getOrder();
  }, []);

  if (!state || !Array.isArray(state.items)) {
    return <div>Không có đơn hàng nào để hiển thị</div>;
  }

  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý đơn hàng</b>
      </p>

      <hr className="tbl" />

      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-1">STT</th>
            <th className="col-3">Tên sản phẩm</th>
            <th className="col-2">Giá (VND)</th>
            <th className="col-2">Số lượng</th>
            <th className="col-2">Thành tiền (VND)</th>
            <th className="col-2">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {state.items.map((item: CartItem, index: number) => (
            <tr key={index} className="text-center d-flex">
              <td className="col-1">{index + 1}</td>
              <td className="col-3">{item.product.title}</td>
              <td className="col-2">{item.product.price.toLocaleString()}</td>
              <td className="col-2">{item.quantity}</td>
              <td className="col-2">
                {(item.product.price * item.quantity).toLocaleString()}
              </td>
              <td className="col-2">
                <button className="btn btn-primary">Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDH;
