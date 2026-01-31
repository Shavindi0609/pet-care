import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Product එකේ Interface එක (මෙය වෙනම types file එකක තියෙනවා නම් වඩාත් හොඳයි)
interface Product {
  id: string;
  name: string;
  price: string;
  brand: string;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Firestore එකෙන් Load කරන දත්ත Store එකට දාන්න
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
    
    // බඩුවක් Cart එකට එකතු කිරීම
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cartItems.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ product: action.payload, quantity: 1 });
      }
    },

    // ප්‍රමාණය වැඩි කිරීම
    incrementQty: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(i => i.product.id === action.payload);
      if (item) item.quantity += 1;
    },

    // ප්‍රමාණය අඩු කිරීම
    decrementQty: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(i => i.product.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(i => i.product.id !== action.payload);
      }
    },

    // Cart එකෙන් සම්පූර්ණයෙන් ඉවත් කිරීම
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(item => item.product.id !== action.payload);
    },

    // Logout වෙද්දී Cart එක Clear කිරීමට
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
});

export const { setCart, addToCart, incrementQty, decrementQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;