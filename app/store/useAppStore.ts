import * as Location from 'expo-location';
import { create } from 'zustand';
import {
    getSecureItem,
    removeSecureItem,
    setSecureItem,
} from '../lib/secureStorage';

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type LocationType = {
  latitude: number;
  longitude: number;
  address?: string;
};

type User = {
  firstName: string;
  lastName: string;
  email: string;
  isLoggedIn: boolean;
  token?: string;
  addresses: string[];
};

type AppState = {
  user: User;
  cart: Product[];
  wishlist: Product[];
  location: LocationType | null;
  loading: boolean;

  hydrate: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setCart: (cart: Product[]) => Promise<void>;
  setWishlist: (wishlist: Product[]) => Promise<void>;
  refreshLocation: () => Promise<void>;
  logout: () => Promise<void>;
};

const defaultUser: User = {
  firstName: '',
  lastName: '',
  email: '',
  isLoggedIn: false,
  addresses: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  user: defaultUser,
  cart: [],
  wishlist: [],
  location: null,
  loading: true,

  hydrate: async () => {
    const user = await getSecureItem<User>('user');
    const cart = await getSecureItem<Product[]>('cart');
    const wishlist = await getSecureItem<Product[]>('wishlist');
    const location = await getSecureItem<LocationType>('location');

    set({
      user: user ?? defaultUser,
      cart: cart ?? [],
      wishlist: wishlist ?? [],
      location: location ?? null,
      loading: false,
    });
  },

  setUser: async (user) => {
    set({ user });
    await setSecureItem('user', user);
  },

  setCart: async (cart) => {
    set({ cart });
    await setSecureItem('cart', cart);
  },

  setWishlist: async (wishlist) => {
    set({ wishlist });
    await setSecureItem('wishlist', wishlist);
  },

  refreshLocation: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const pos = await Location.getCurrentPositionAsync({});
    const newLocation = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    set({ location: newLocation });
    await setSecureItem('location', newLocation);
  },

  logout: async () => {
    set({
      user: defaultUser,
      cart: [],
      wishlist: [],
      location: null,
    });

    await removeSecureItem('user');
    await removeSecureItem('cart');
    await removeSecureItem('wishlist');
    await removeSecureItem('location');
  },
}));
