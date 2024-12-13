import { useContext, useEffect, useState } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import { CartItem } from "../../api/reducers/CartReducer";
import { useNavigate } from "react-router-dom";
import {
  FaMinusCircle,
  FaPlusCircle,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import ins from "../../api";

const Cart = () => {
  const { state, removeFromCart, checkout, addToCart, fetchCart } = useContext(
    CartContext
  ) as CartContextType;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCart();
  }, []);
  const handleRemoveFromCart = (variantId: string) => {
    removeFromCart(variantId);
  };

  const handleDecreaseQuantity = (product: CartItem) => {
    if (product?.quantity > 1) {
      addToCart({
        productId: product.product._id,
        quantity: -1,
        price: product.price,
        variantId: product.variantId,
        selectedColor: product.color,
        selectedStorage: product.storage,
      });
    }
  };

  const handleIncreaseQuantity = (product: CartItem) => {
    addToCart({
      productId: product.product._id,
      quantity: 1,
      price: product.price,
      variantId: product.variantId,
      selectedColor: product.color,
      selectedStorage: product.storage,
    });
  };

  const handleCheckout = async () => {
    try {
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng đăng nhập",
          text: "Vui lòng đăng nhập trước khi thanh toán",
          confirmButtonText: "Đăng nhập",
          cancelButtonText: "Đóng",
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
      if (state.products.length === 0 ) {
        Swal.fire({
          icon: "warning",
          title: "Giỏ hàng trống",
          text: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán",
        });
      } else {
        const res = await ins.post("/products/check-stock" , {cartItems:state.products});
        if (res.status === 200) {
          navigate("/vnpay");
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.unavailableVariants[0].message || "Đã xảy ra lỗi, vui lòng thử lại!",
      });
    }
  };

  // Tính toán tổng tiền sau khi giảm giá
  return (
    <div className="container">
      <h1>
        <FaShoppingCart className="me-2" />
        Giỏ hàng
      </h1>
      {/* Bảng hiển thị thông tin người dùng */}
      <h2>Thông tin người dùng</h2>
      {/* <table className="table table-hover">
        <tbody>
          <tr>
            <th>Tên:</th>
            <td>
              {JSON.parse(localStorage.getItem("user") || "{}").first_name +
                " " +
                JSON.parse(localStorage.getItem("user") || "{}").last_name}
            </td>
          </tr>
          <tr>
            <th>Địa chỉ:</th>
            <td>{JSON.parse(localStorage.getItem("user") || "{}").address}</td>
          </tr>
          <tr>
            <th>Số điện thoại:</th>
            <td>{JSON.parse(localStorage.getItem("user") || "{}").phone}</td>
          </tr>
        </tbody>
      </table> */}
      <table className="table table-hover ">
        <thead>
          <tr className="table-info">
            <th className="col-4">Tên sản phẩm</th>
            <th className="col-3">Màu sắc</th>
            <th className="col-3">Dung lượng</th>
            <th className="col-3">Số lượng</th>
            <th className="col-2">Đơn Giá</th>
            <th className="col-2">Giá</th>
            <th className="col-1">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {state.products.length > 0 ? (
            state.products.map((product: CartItem, index: number) => (
              <tr key={index}>
                <td className="row-4">{product.product?.title}</td>
                <td className="row-3">{product.color}</td>
                <td className="row-3">{product.storage}</td>
                <td className="row-3">
                  <FaMinusCircle
                    onClick={() => handleDecreaseQuantity(product)}
                    className="text-danger"
                  />{" "}
                  {product?.quantity}{" "}
                  <FaPlusCircle
                    onClick={() => handleIncreaseQuantity(product)}
                    className="text-primary"
                  />
                </td>
                <td>{product?.price}</td>
                <td className="row-4">
                  {(product.price * product.quantity).toLocaleString()}
                </td>
                <td>
                  <FaTrash
                    onClick={() => handleRemoveFromCart(product.variantId)}
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                Giỏ hàng trống
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tổng tiền sau khi giảm giá */}
      <div className="my-4 row fs-5">
        <div className="text-right col">
          <strong>Tổng tiền:</strong>
        </div>
        <div className="text-right col fw-bold">
          <span>{state.totalPrice.toLocaleString()} đ</span>
        </div>
      </div>

      <div className="my-4">
        <button onClick={handleCheckout} className="btn btn-success">
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
