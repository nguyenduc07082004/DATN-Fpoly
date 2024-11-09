import React, { useContext, useEffect } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import { CartItem } from "../../api/reducers/OrderReducer";

const QLDH = () => {
  const { state, getOrder } = useContext(OrderContext) as OrderContextType;
  console.log(state);

  useEffect(() => {
    getOrder();
  }, []);

  if (!state || !Array.isArray(state.items)) {
    return <div>ok</div>;
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
            <th className="col-3">STT</th>
            <th className="col-3">Tên sản phẩm</th>
            <th className="col-1">Giá(VND)</th>
            <th className="col-1">Số lượng</th>
            <th className="col-4">Chức năng</th>
          </tr>
        </thead>
        <tbody className="table">
          {state.items.map((item, index) => (
            <tr className="d-flex">
              <td>{index + 1}</td>
              <td className="col-3">{}</td>
              <td className="col-1">{}</td>
              <td className="col-1">{item.quantity}</td>
              <th className="col-4">OK</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDH;
