import React, { createContext, useReducer, ReactNode } from "react";
import { Products } from "../../interfaces/Products";
import cartReducer from "../reducers/CartReducer";
import ins from "../index";

export type CartContextType = {
  state: {
    products: { product: Products; quantity: number }[];
    totalPrice: number;
  };
  dispatch: React.Dispatch<any>;
  addToCart: (product: Products, quantity: number) => void;
  getCart: () => void;
  checkout: () => void;
  removeFromCart: (productId: string) => void;
};

const initialState = {
  products: [],
  totalPrice: 0,
};

const CartContext = createContext({} as CartContextType);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const addToCart = async (product: Products, quantity: number) => {
    const res = await ins.post("/carts/add", {
      productId: product._id,
      quantity,
    });

    dispatch({
      type: "ADD_TO_CART",
      payload: { product: res.data.product, quantity },
    });
  };
  const getCart = async () => {
    const res = await ins.get("/carts");
    dispatch({ type: "SET_CART", payload: res.data });
  };
  const checkout = async () => {
    const res = await ins.post("/cart/checkout");
    dispatch({ type: "CHECKOUT", payload: res.data });
  };

  const removeFromCart = async (productId: string) => {
    const res = await ins.delete(`/cart/${productId}`);
    res.data.success &&
      dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
  };

  return (
    <CartContext.Provider
      value={{ state, dispatch, addToCart, getCart, checkout, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
