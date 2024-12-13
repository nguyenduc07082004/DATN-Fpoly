import "../.././App.scss";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { baseURL } from "../../api";
import { orderStatusColors, getStatusText } from "../../utils/colorUtils";
import ins from "../../api";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await ins.get(`${baseURL}/orders/order/${id}`);
        const data = response.data;
        setOrder(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!order) {
    return <div>Không có dữ liệu cho đơn hàng này.</div>;
  }

  const handlePrintInvoice = () => {
    // Đây là nơi bạn có thể xử lý in hóa đơn, ví dụ như mở cửa sổ in
    window.print(); // Hoặc một phương thức khác tùy vào cách bạn muốn in hóa đơn
  };

  return (
    <div   className="container-xl rounded shadow-sm p-4"
    style={{
      backgroundColor: '#f8f8f8', // Màu trắng bạc
      borderRadius: '0.25rem',    // Bo góc
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Bóng mờ
    }}>
      <p className="m-3">
        <b className="h2">Chi tiết đơn hàng</b>
      </p>
      <hr className="tbl" />

      <h3>Thông tin đơn hàng</h3>
      <table className="table">
        <tbody>
          <tr>
            <td>
              <b>Mã đơn hàng:</b>
            </td>
            <td>{order._id}</td>
          </tr>
          <tr>
            <td>
              <b>Người nhận:</b>
            </td>
            <td>{order.receiver_name}</td>
          </tr>
          <tr>
            <td>
              <b>Địa chỉ giao hàng:</b>
            </td>
            <td>{order.receiver_address}</td>
          </tr>
          <tr>
            <td>
              <b>Số điện thoại:</b>
            </td>
            <td>{order.receiver_phone}</td>
          </tr>
          {order.voucher && order.discount_value !== 0 && (
            <>
              <tr>
                <td>
                  <b>Mã giảm giá:</b>
                </td>
                <td>{order.voucher}</td>
              </tr>
            </>
          )}
          <tr>
            <td>
              <b>Ngày đặt hàng:</b>
            </td>
            <td>{order.created_at.slice(0, 10)}</td>
          </tr>
          <tr>
            <td>
              <b>Trạng thái đơn hàng</b>
            </td>
            <td
              className={
                orderStatusColors[
                  order.status as keyof typeof orderStatusColors
                ] || ""
              }
            >
              {getStatusText(order.status)}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Chi tiết sản phẩm</h3>
      <table className="table">
        <thead>
          <tr>
            <th className="col-1">STT</th>
            <th className="col-2">Tên sản phẩm</th>
            <th className="col-2">Dung lượng / Màu</th>
            <th className="col-1">Số lượng</th>
            <th className="col-2">Giá</th>
            <th className="col-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order?.items?.map((item: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.product.title}</td>
              <td>
                {item.color} / {item.storage}
              </td>
              <td>{item.quantity}</td>
              <td>
                {item.price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
              <td className="text-danger fw-bold">
                {(item.quantity * item.price).toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Thông tin thanh toán</h3>
      <table className="table">
        <tbody>
        <tr>
            <td>
            <b>Tổng tiền đơn hàng:</b>
            </td>
            <td className="text-danger fw-bold">
              {order.items.reduce((total: number, item: any) => total + item.quantity * item.price, 0).toLocaleString("vi", {
                style: "currency",
                currency: "VND",
            })}
            </td>
          </tr>
        {order.voucher && order.discount_value !== 0 && (
        <tr>
                <td>
                  <b className="fw-bold">Giá trị giảm giá:</b>
                </td>
                <td className="fw-bold text-info">{order.discount_value.toLocaleString("vi", { style: "currency", currency: "VND" })}</td>
              </tr>
        )}
          <tr>
            <td>
              <b>Tổng tiền:</b>
            </td>
            <td className="text-danger fw-bold">
              {order.total_price.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </td>
          </tr>
          <tr>
            <td>
              <b>Trạng thái thanh toán:</b>
            </td>
            <td
              className={`fw-bold ${
                order.payment_status === "paid"
                  ? "text-success"
                  : "text-warning"
              }`}
            >
              {order.payment_status === "paid"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="my-4 d-flex justify-content-center align-items-center">
        <button className="mx-2 btn btn-secondary">
          <Link to="/orderplace" className="text-decoration-none text-dark">
            Quay lại
          </Link>
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
