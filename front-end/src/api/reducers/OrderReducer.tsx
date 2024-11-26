import { Products } from "../../interfaces/Products";

export type CartItem = {
  receiver_phone: string;
  created_at: string;
  payment_status: string;
  receiver_address: string;
  receiver_name: string;
  _id: string;
  product: Products;
  quantity: number;
  payment: string;
  totalPrice: number;
  status: string;
};

export type State = {
  products: CartItem[];
};

type OrderAction =
  | { type: "GET_ORDER"; payload: { products: CartItem[] } }
  | {
      type: "UPDATE_ORDER_STATUS";
      payload: { orderId: string; status: string };
    }
  | { type: "ADD_ORDER"; payload: CartItem } // Thêm hành động ADD_ORDER
  | { type: "GET_ORDER_ID"; payload: { products: CartItem[] } } | { type: "UPDATE_PAYMENT_STATUS"; payload: { orderId: string; payment_status: string } };

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

      case "UPDATE_PAYMENT_STATUS":
      return {
        ...state,
        products: state.products.map((order) =>
          order._id === action.payload.orderId
            ? { ...order, payment_status: action.payload.payment_status }
            : order
        ),
      };

    case "ADD_ORDER": 
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    default:
      return state;
  }
};

export default orderReducer;
