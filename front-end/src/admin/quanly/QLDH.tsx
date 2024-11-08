import "../.././App.scss";
import { useContext, useEffect, useState } from "react";
import { ProdContext } from "../../api/contexts/ProductsContexts";
import { Link, useParams } from "react-router-dom";
import ins from "../../api";
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
  console.log(state.orders);
  return (
    <div>
      <p className="m-3">
        <b className="h2">Quản lý đơn hàng</b>
      </p>

      <hr className="tbl" />

      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
            <th className="col-3">Tên khách hàng</th>
            <th className="col-3">Tên sản phẩm</th>
            <th className="col-1">Giá(VND)</th>
            <th className="col-1">Số lượng</th>
            <th className="col-4">Chức năng</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default QLDH;
