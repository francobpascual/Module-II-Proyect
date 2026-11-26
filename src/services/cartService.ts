import type { Game } from "../interfaces/Game";
import type { CartItem } from "../interfaces/Cart";
import { localStorageService } from "./localStorageService";

const CART_UPDATED_EVENT = "cartUpdated";

const getStorageKey = (userId: string): string =>
 `gamerlix-cart:${userId}`;

function notifyCartUpdated(): void {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export const cartService = {
  getItems(userId: string): CartItem[] {
    const storedItems = localStorageService.getItem<CartItem[]>(
      getStorageKey(userId)
    );

    return Array.isArray(storedItems) ? storedItems : [];
  },

  addItem(userId: string, game: Game): boolean {
    if (!userId) return false;

    // No permitir comprar juegos próximos a lanzarse.
    if (game.status === "upcoming") return false;

    const items = this.getItems(userId);

    // Evitar duplicados de videojuegos digitales.
    if (items.some((item) => item.gameId === game.id)) {
      return false;
    }

    const newItem: CartItem = {
      gameId: game.id,
      title: game.title,
      image: game.image,
      price: game.price,
    };

    localStorageService.setItem(
      getStorageKey(userId),
      [...items, newItem]
    );

    notifyCartUpdated();
    return true;
  },

  removeItem(userId: string, gameId: string): void {
    if (!userId) return;

    const items = this.getItems(userId);
    const updatedItems = items.filter(
      (item) => item.gameId !== gameId
    );

    if (updatedItems.length === items.length) return;

    localStorageService.setItem(
      getStorageKey(userId),
      updatedItems
    );

    notifyCartUpdated();
  },

  clearCart(userId: string): void {
    if (!userId) return;

    localStorageService.removeItem(getStorageKey(userId));
    notifyCartUpdated();
  },

  getCount(userId: string): number {
    return this.getItems(userId).length;
  },

  getTotal(userId: string): number {
    return this.getItems(userId).reduce(
      (total, item) => total + item.price,
      0
    );
  },

  isInCart(userId: string, gameId: string): boolean {
    return this.getItems(userId).some(
      (item) => item.gameId === gameId
    );
  },

  subscribe(callback: () => void): () => void {
    window.addEventListener(CART_UPDATED_EVENT, callback);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, callback);
    };
  },
};