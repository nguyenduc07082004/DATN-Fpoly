import React, { useContext, useEffect } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import { CartItem } from "../../api/reducers/CartReducer";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { state, getCart, removeFromCart, checkout } = useContext(CartContext) as CartContextType;
  const navigate = useNavigate();

  useEffect(() => {
    getCart();
  }, []);

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
    getCart();
  };

  const handleCheckout = async () => {
    await checkout();  // Xử lý thanh toán
    navigate("/product-page");  // Chuyển hướng sang trang ProductPage
  };

  return (
    <>
      <h1>Gio hang cua ban!</h1>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ten san pham</th>
            <th>So luong</th>
            <th>Gia</th>
            <th>Thanh tien</th>
            <th>Xoa</th>
          </tr>
        </thead>
        <tbody>
          {state.products.map((product: CartItem, index: number) => (
            <tr key={product.product?._id}>
              <td>{index + 1}</td>
              <td>{product.product?.title}</td>
              <td>{product?.quantity}</td>
              <td>{product.product?.price}</td>
              <td>{product.product?.price * product?.quantity}</td>
              <td>
                <button
                  onClick={() =>
                    handleRemoveFromCart(String(product.product._id))
                  }
                  className="btn btn-danger"
                >
                  Xoa
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4}>Tong tien</td>
            <td>{state.totalPrice}</td>
            <td>
              <button onClick={handleCheckout} className="btn btn-success">
                Thanh toan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Cart;
