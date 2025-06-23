import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../../types';
import { Alert } from 'react-native';

interface CartContextData {
  cart: Product[];
  addToCart: (product: Product) => void;
  cartItemCount: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    Alert.alert("Sucesso", `${product.name} foi adicionado ao carrinho!`);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, cartItemCount: cart.length }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}