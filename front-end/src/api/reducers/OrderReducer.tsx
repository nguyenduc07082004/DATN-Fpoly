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

type OrderAction = {
  type: "GET_ORDER";
  payload: { products: CartItem[] };
};
export const initialState = {
  products: [],
};

// Thêm loại hành động cho checkout

const orderReducer = (state: State, action: OrderAction) => {
  switch (action.type) {
    case "GET_ORDER":
      return {
        ...state,
        products: action.payload,
      };

    default:
      return state;
  }
};

export default orderReducer;
