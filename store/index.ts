import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import petReducer from "../redux/petSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
