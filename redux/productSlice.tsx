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
  loading: boolean;
}

const initialState: ProductState = {
  items: [],
  loading: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // බඩු ලිස්ට් එක Firestore එකෙන් අරන් මෙතනට දානවා
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    // Loading state එක පාලනය කිරීමට (අවශ්‍ය නම් පමණක්)
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, setLoading } = productSlice.actions;
export default productSlice.reducer;