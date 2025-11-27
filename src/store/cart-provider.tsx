import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { CartContext, type CartContextValue } from "./cart-context";
import { getProductImage } from "@/utils/productImages";

const storageKey = "ecommerce_cart_items";

const loadPersistedItems = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
};

const persistItems = (items: CartItem[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(storageKey, JSON.stringify(items));
};

const buildItem = (product: Product, quantity: number): CartItem => ({
  id: product.id,
  name: product.name,
  price: product.price,
  quantity,
  imageUrl: product.imageUrl || getProductImage(product.name),
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadPersistedItems);

  useEffect(() => {
    persistItems(items);
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, buildItem(product, quantity)];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const changeQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  }, [removeItem]);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    return {
      items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      changeQuantity,
      clear,
    };
  }, [items, addItem, removeItem, changeQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


