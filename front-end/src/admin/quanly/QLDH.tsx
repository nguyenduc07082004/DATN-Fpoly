import React, { useContext, useEffect } from "react";
import {
  OrderContext,
  OrderContextType,
} from "../../api/contexts/OrdersContext";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { CartItem } from "../../api/reducers/OrderReducer";

const QLDH = () => {
  const { state, fetchOrder } = useContext(OrderContext) as OrderContextType;
  console.log(state);

  useEffect(() => {
    fetchOrder();
  }, []);

  if (!state || !Array.isArray(state.products)) {
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
            <th className="col-2">Số lượng</th>
            <th className="col-2">Thành tiền (VND)</th>
            <th className="col-2">Chức năng</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {state.products.map((order, orderIndex) => (
            <React.Fragment key={order._id}>
              {order.products.map((item: CartItem, productIndex: number) => (
                <tr className="d-flex" key={item.product._id}>
                  {productIndex === 0 && (
                    <td className="col-1" rowSpan={order.products.length}>
                      {orderIndex + 1}
                    </td>
                  )}
                  <td className="col-3">{item.product.title}</td>
                  <td className="col-2">{item.quantity}</td>
                  {productIndex === 0 && (
                    <>
                      <td className="col-2" rowSpan={order.products.length}>
                        {order.totalPrice}
                      </td>
                      <td className="col-2" rowSpan={order.products.length}>
                        {order.status}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLDH;
