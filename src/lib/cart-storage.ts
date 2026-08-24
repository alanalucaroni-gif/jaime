import { normalizeCart, type CartItem } from "@/lib/menu";

export const CART_STORAGE_KEY = "jaime-cart-v1";
const CART_STORAGE_EVENT = "jaime-cart-change";
const emptyCart: CartItem[] = [];
let cachedCart: CartItem[] | undefined;

export function loadCart() {
  if (typeof window === "undefined") return emptyCart;
  if (cachedCart) return cachedCart;

  try {
    cachedCart = normalizeCart(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]"));
  } catch {
    cachedCart = emptyCart;
  }

  return cachedCart;
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  cachedCart = normalizeCart(cart);
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cachedCart));
  window.dispatchEvent(new Event(CART_STORAGE_EVENT));
}

export function subscribeToCart(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const refreshFromStorage = () => {
    cachedCart = undefined;
    listener();
  };

  window.addEventListener(CART_STORAGE_EVENT, listener);
  window.addEventListener("storage", refreshFromStorage);
  return () => {
    window.removeEventListener(CART_STORAGE_EVENT, listener);
    window.removeEventListener("storage", refreshFromStorage);
  };
}

export function getServerCart() {
  return emptyCart;
}

