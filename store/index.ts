import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import petReducer from "../redux/petSlice";
import medicalReducer from "../redux/medicalSlice";
import productReducer from "../redux/productSlice";
import cartReducer from "../redux/cartSlice"; // අලුත් එක

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    medical: medicalReducer,
    products: productReducer,
    cart: cartReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Error එක එන එක නවත්වන්න
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
