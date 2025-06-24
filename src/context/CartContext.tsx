// src/context/CartContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// 1. Importa os tipos de um local central. Isto está correto.
import { Product, CartItem } from '../../types';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@ProdutosApp:cart';

// 2. A declaração local da interface "CartItem" foi REMOVIDA daqui.

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeProductFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  loading: boolean;
  total: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Efeito para carregar o carrinho do armazenamento
  useEffect(() => {
    async function loadCartData() {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Falha ao carregar o carrinho do armazenamento.", error);
      } finally {
        setLoading(false);
      }
    }
    loadCartData();
  }, []);

  // Efeito para salvar o carrinho no armazenamento
  useEffect(() => {
    if (!loading) {
      async function saveCartData() {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
          console.error("Falha ao salvar o carrinho no armazenamento.", error);
        }
      }
      saveCartData();
    }
  }, [cart, loading]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    Alert.alert("Sucesso", `${product.name} foi adicionado ao carrinho!`);
  };

  const removeProductFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === productId);

      if (existingItem?.quantity === 1) {
        return prevCart.filter(item => item.id !== productId);
      }
      
      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((total, product) => total + product.quantity, 0);
  
  const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        cartItemCount, 
        loading, 
        total,
        removeProductFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
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