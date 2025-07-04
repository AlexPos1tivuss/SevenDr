import { useState, useEffect } from "react";
import { CartItem } from "@/lib/types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      let newCart;
      
      if (existingItem) {
        newCart = prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        newCart = [...prev, item];
      }
      
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const getItemPrice = (item: CartItem) => {
    if (item.quantity >= 50) return Number(item.price["50"]);
    if (item.quantity >= 20) return Number(item.price["20"]);
    return Number(item.price["5"]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getItemPrice,
    getTotalPrice,
    getTotalItems,
  };
}
