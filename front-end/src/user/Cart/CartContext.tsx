// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem, Products } from "../../interfaces/Products";
import { User } from "../../interfaces/User";
import { useAuth } from "../../api/contexts/AuthContext"; // Import useAuth to get user data

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Products) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  user: User | null; // Include user information
  isLoggedIn: boolean; // Add a flag to indicate if the user is logged in
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth(); // Get user data from AuthContext
  const isLoggedIn = !!user; // Check if user is logged in

  // Load cart items from local storage when user logs in
  useEffect(() => {
    if (user) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || "[]");
      setCartItems(storedCart);
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [user]);

  // Save cart items to local storage whenever cartItems changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product: Products) => {
    if (!isLoggedIn) {
      // If the user is not logged in, prompt them to log in
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, userId: user?.id }];
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, user, isLoggedIn }}>
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
