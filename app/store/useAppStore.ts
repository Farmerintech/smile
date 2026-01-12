import * as Location from "expo-location";
import { create } from "zustand";
import {
  getSecureItem,
  removeSecureItem,
  setSecureItem,
} from "../lib/secureStorage";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export type CartItem = Product & {
  quantity: number;
};

type LocationType = {
  latitude: number;
  longitude: number;
};

type User = {
  username: string;
  email: string;
  isLoggedIn: boolean;
  token?: string;
  addresses?: string[];
};

type AppState = {
  user: User;
  cart: CartItem[];
  wishlist: Product[];
  location: LocationType | null;
  loading: boolean;

  hydrate: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  setWishlist: (wishlist: Product[]) => Promise<void>;
  refreshLocation: () => Promise<void>;
  logout: () => Promise<void>;
};

/* ================= DEFAULTS ================= */

const defaultUser: User = {
  username: "",
  email: "",
  isLoggedIn: false,
  addresses: [],
};

/* ================= STORE ================= */

export const useAppStore = create<AppState>((set, get) => ({
  user: defaultUser,
  cart: [],
  wishlist: [],
  location: null,
  loading: true,

  hydrate: async () => {
    const cart = await getSecureItem<CartItem[]>("cart");
    const user = await getSecureItem<User>("user");

    set({
      cart: cart ?? [],
      user: user ?? defaultUser,
      loading: false,
    });
  },

  setUser: async (user) => {
    set({ user });
    await setSecureItem("user", user);
  },

  addToCart: async (item) => {
    const cart = get().cart;
    const existing = cart.find((i) => i.id === item.id);

    let updatedCart: CartItem[];

    if (existing) {
      updatedCart = cart.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedCart = [...cart, item];
    }

    set({ cart: updatedCart });
    await setSecureItem("cart", updatedCart);
  },

  /* ✅ REMOVE ITEM */
  removeFromCart: async (id) => {
    const updatedCart = get().cart.filter((item) => item.id !== id);
    set({ cart: updatedCart });
    await setSecureItem("cart", updatedCart);
  },

  setWishlist: async (wishlist) => {
    set({ wishlist });
    await setSecureItem("wishlist", wishlist);
  },

  refreshLocation: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const pos = await Location.getCurrentPositionAsync({});
    const location = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    set({ location });
    await setSecureItem("location", location);
  },

  logout: async () => {
    set({
      user: defaultUser,
      cart: [],
      wishlist: [],
      location: null,
    });

    await removeSecureItem("user");
    await removeSecureItem("cart");
    await removeSecureItem("wishlist");
    await removeSecureItem("location");
  },
}));
