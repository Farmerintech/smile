
// // Define interfaces
// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   token: string;
//   role: string;
// }

// interface Message {
//   text: string;
// }

// export interface UserState {
//   user: User;
//   message: Message;
// }

// export type UserAction =
//   | { type: 'Login'; payload: Partial<User> }
//   | { type: 'Logout' };

// // Initial state
// export const InitialStates: UserState = {
//   user: {
//     firstName: '',
//     lastName: '',
//     email: '',
//     token: '',
//     role: '',
//   },
//   message: {
//     text: ''
//   }
// };

// // Reducer
// export const UserReducer = (state: UserState, action: UserAction): UserState => {
//   switch (action.type) {
//     case 'Login':
//       return {
//         ...state,
//         user: {
//           ...state.user,
//           ...action.payload
//         }
//       };
//     case 'Logout':
//       return InitialStates;
//     default:
//       return state;
//   }
// };

// // Context type
// interface UserContextType {
//   state: UserState;
//   dispatch: Dispatch<UserAction>;
// }

// // Create context with default value as undefined
// export const UserContext = createContext<UserContextType | undefined>(undefined);



import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  firstName: string;
  lastName: string;
  DOB: Date | null;
  isLoggedIn: boolean;
  email: string;
  addresses: string[];
};

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type AppContextType = {
  user: User;
  setUser: (user: User) => void;
  cart: Product[];
  setCart: (cart: Product[]) => void;
  wishlist: Product[];
  setWishlist: (wishlist: Product[]) => void;
  loading: boolean;
};

const defaultUser: User = {
  firstName: '',
  lastName: '',
  DOB: null,
  isLoggedIn: false,
  email: '',
  addresses: [],
};

const AppContext = createContext<AppContextType>({
  user: defaultUser,
  setUser: () => {},
  cart: [],
  setCart: () => {},
  wishlist: [],
  setWishlist: () => {},
  loading: true,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User>(defaultUser);
  const [cart, setCartState] = useState<Product[]>([]);
  const [wishlist, setWishlistState] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const cartData = await AsyncStorage.getItem('cart');
        const wishlistData = await AsyncStorage.getItem('wishlist');

        if (userData) setUserState(JSON.parse(userData));
        if (cartData) setCartState(JSON.parse(cartData));
        if (wishlistData) setWishlistState(JSON.parse(wishlistData));
      } catch (e) {
        console.error("Error loading app data:", e);
      } finally {
        setLoading(false);
      }
    };
    loadAppData();
  }, []);

  const setUser = (user: User) => {
    setUserState(user);
    AsyncStorage.setItem('user', JSON.stringify(user));
  };

  const setCart = (cart: Product[]) => {
    setCartState(cart);
    AsyncStorage.setItem('cart', JSON.stringify(cart));
  };

  const setWishlist = (wishlist: Product[]) => {
    setWishlistState(wishlist);
    AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart, wishlist, setWishlist, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);