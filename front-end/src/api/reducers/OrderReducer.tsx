import { Products } from "../../interfaces/Products";

export type CartItem = {
  _id: string;
  product: Products;
  quantity: number;
  totalPrice: number;
  status: string;
};

export type State = {
  products: CartItem[];
};

type OrderAction =
  | { type: "GET_ORDER"; payload: { products: CartItem[] } }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: string } }
  | { type: "ADD_ORDER"; payload: CartItem }; // Thêm hành động ADD_ORDER

export const initialState: State = {
  products: [],
};

const orderReducer = (state: State, action: OrderAction): State => {
  switch (action.type) {
    case "GET_ORDER":
      return {
        ...state,
        products: action.payload.products,
      };

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        products: state.products.map((order) =>
          order._id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };

    case "ADD_ORDER": // Thêm đơn hàng mới vào state
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    default:
      return state;
  }
};

export default orderReducer;