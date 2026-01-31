import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: string;
  name: string;
  price: string;
  brand: string;
  image: string;
  animalType: string;
  color: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductState {
  items: Product[];
  cart: CartItem[];
  loading: boolean;
}

const initialState: ProductState = {
  items: [],
  cart: [],
  loading: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    // --- අලුතින් එකතු කළ කොටස ---
    incrementQty: (state, action: PayloadAction<string>) => {
      const item = state.cart.find(i => i.product.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQty: (state, action: PayloadAction<string>) => {
      const item = state.cart.find(i => i.product.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // Quantity එක 1 ට වඩා අඩු වුණොත් cart එකෙන් අයින් කරනවා
        state.cart = state.cart.filter(i => i.product.id !== action.payload);
      }
    },
  },
});

export const { setProducts, addToCart, removeFromCart, incrementQty, decrementQty } = productSlice.actions;
export default productSlice.reducer;