import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { Products } from "../../interfaces/Products";
import { User } from "../../interfaces/User";
import cartReducer from "../reducers/CartReducer";
import ins from "../index";

export type CartContextType = {
  state: {
    userId: { user: User } | null;
    products: { product: Products; quantity: number, price: number }[];
    totalPrice: number;
    order: any;
  };
  dispatch: React.Dispatch<any>;
  addToCart: (product: Products, quantity: number, price: number) => void;
  checkout: () => void;
  removeFromCart: (productId: string) => void;
  fetchCart: () => void;
};
const initialState = {
  userId: null,
  products: [],
  totalPrice: 0,
  order: null, // Khởi tạo order là null
};

const CartContext = createContext({} as CartContextType);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const token = localStorage.getItem("accessToken");

  const fetchCart = async () => {
    const res = await ins.get("/carts");
    dispatch({ type: "SET_CART", payload: res.data });
  };
  useEffect(() => {
    fetchCart();
  }, []);
  const addToCart = async (product: Products, quantity: number , price: number) => {
    try {
      const res = await ins.post("/carts/add", {
        productId: product._id,   
        quantity,                
        price: price 
      });
  
      dispatch({
        type: "ADD_TO_CART",
        payload: { 
          product: res.data.product, 
          quantity,                 
          price: price   
        },
      });
  
      fetchCart(); 
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  const checkout = async () => {
    const res = await ins.post("/orders/checkout");
    dispatch({ type: "CHECKOUT", payload: res.data });
  };

  const removeFromCart = async (productId: string) => {
    try {
     await ins.delete(`/carts/remove/${productId}`, {
        data: { productId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        dispatch,
        addToCart,
        checkout,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
