import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import petReducer from "../redux/petSlice";
import medicalReducer from "../redux/medicalSlice";
import productReducer from "../redux/productSlice";
import cartReducer from "../redux/cartSlice"; // අලුත් එක
import providerReducer from "../redux/providerSlice"
import appointmentReducer from "../redux/appointmentSlice";
import postReducer from '../redux/postSlice'; // පාර හරියටම චෙක් කරන්න

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    medical: medicalReducer,
    products: productReducer,
    cart: cartReducer,
    provider: providerReducer,
    appointment: appointmentReducer,
    posts: postReducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Error එක එන එක නවත්වන්න
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
