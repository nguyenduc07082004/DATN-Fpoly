// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Products } from "../../interfaces/Products";
import { User } from "../../interfaces/User"; // Import User interface

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Products) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  user: User | null; // Include user information
  setUser: (user: User | null) => void; // Setter for user information
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null); // Initialize user state

  const addToCart = (product: Products) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, user, setUser }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
