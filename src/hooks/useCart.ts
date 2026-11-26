import { useEffect, useState } from "react";
import type { Game } from "../interfaces/Game";
import type { CartItem } from "../interfaces/Cart";
import { cartService } from "../services/cartService";
import { useAuth } from "./useAuth";

export function useCart() {
  const { currentUser, isAuthenticated } = useAuth();

  const userId = currentUser?.id;

  const [items, setItems] = useState<CartItem[]>(() =>
    userId ? cartService.getItems(userId) : []
  );

  useEffect(() => {
    const updateCart = () => {
      setItems(userId ? cartService.getItems(userId) : []);
    };

    updateCart();

    const unsubscribe = cartService.subscribe(updateCart);

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const addToCart = (game: Game): boolean => {
    if (!isAuthenticated || !userId) {
      return false;
    }

    return cartService.addItem(userId, game);
  };

  const removeFromCart = (gameId: string): void => {
    if (!userId) return;

    cartService.removeItem(userId, gameId);
  };

  const clearCart = (): void => {
    if (!userId) return;

    cartService.clearCart(userId);
  };

  const isInCart = (gameId: string): boolean => {
    return items.some((item) => item.gameId === gameId);
  };

  const cartCount = items.length;

  const cartTotal = items.reduce(
    (total, item) => total + item.price,
    0
  );

  return {
    items,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  };
}