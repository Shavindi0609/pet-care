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

interface ProductState {
  items: Product[];
  cart: { product: Product; quantity: number }[];
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
    // Firestore එකෙන් ගන්න දත්ත Store එකට දැමීම
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    // Cart එකට බඩු එකතු කිරීම
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ product: action.payload, quantity: 1 });
      }
    },
    // Cart එකෙන් අයින් කිරීම
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
  },
});

export const { setProducts, addToCart, removeFromCart } = productSlice.actions;
export default productSlice.reducer;