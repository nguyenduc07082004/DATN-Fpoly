import { Products } from "../../interfaces/Products";
type State = {
  products: Products[];
};

type Action =
  | { type: "LIST_PRODUCTS"; payload: Products[] }
  | { type: "ADD_PRODUCT"; payload: Products }
  | { type: "EDIT_PRODUCT"; payload: Products }
  | { type: "DELETE_PRODUCT"; payload: string };
export const initialState = {
  products: [],
  currentPage: 1,
  totalPages: 0,
  indexOfFirstProduct: 0,
  searchQuery: "",
};

const productsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LIST_PRODUCTS":
      return { ...state, products: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "EDIT_PRODUCT":
      return {
        ...state,
        products: state.products.map((i) =>
          i._id === action.payload._id ? action.payload : i
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((i) => i._id !== action.payload),
      };
    default:
      return state;
  }
};
export default productsReducer;
