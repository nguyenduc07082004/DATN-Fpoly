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

const CartContext = createContext<CartContextType>({} as CartContextType);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = async (product: Products, quantity: number) => {
    try {
      const res = await ins.post("/carts/add", {
        productId: product._id,
        quantity,
      });
      dispatch({
        type: "ADD_TO_CART",
        payload: { product: res.data.product, quantity },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const getCart = async () => {
    try {
      const res = await ins.get("/carts");
      dispatch({ type: "SET_CART", payload: res.data });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const checkout = async () => {
    try {
      const res = await ins.post("/cart/checkout");
      dispatch({ type: "CHECKOUT", payload: res.data });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await ins.delete(`/cart/${productId}`);
      if (res.data.success) {
        dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
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
