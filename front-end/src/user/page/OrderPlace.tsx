import { useEffect, useState } from "react";
import ins from "../../api";

const OrderPlace = () => {
  const [orderData, setOrderData] = useState<any>([]);
  const OrderPlace = async (id: string) => {
    const res = await ins.get(`/orders/${id}`);
    setOrderData(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    OrderPlace("id");
  }, []);
  return (
    <div>
      <h1>Đơn hàng</h1>
      <table className="table">
        <thead className="text-center">
          <tr className="d-flex">
          <th className="col-1">Mã </th>
            <th className="col-2">Tên sản phẩm</th>
            <th className="col-1">Giá(VND)</th>
            <th className="col-2">Số lượng</th>
            <th className="col-2">Thành tiền</th>
            <th className="col-2">Thanh toán</th>
            <th className="col-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {orderData.map((item: any, index: number) => (
            <tr className="d-flex" key={index}>
              <td className="col-1">{item._id}</td>
          <td className=""></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderPlace;
