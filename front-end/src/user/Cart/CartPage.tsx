import { useContext } from "react";
import { CartContext, CartContextType } from "../../api/contexts/CartContext";
import { CartItem } from "../../api/reducers/CartReducer";

const Cart = () => {
  const { state, removeFromCart, checkout } = useContext(
    CartContext
  ) as CartContextType;
  console.log(state);
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
            <tr key={product.product._id}>
              <td>{index + 1}</td>
              <td>{product.product.title}</td>
              <td>{product.quantity}</td>
              <td>{product.product.price}</td>
              <td>{product.product.price * product.quantity}</td>
              <td>
                <button
                  onClick={() => removeFromCart(String(product.product._id))}
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
              <button onClick={checkout} className="btn btn-success">
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
