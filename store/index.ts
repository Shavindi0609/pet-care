import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import petReducer from "../redux/petSlice";
import medicalReducer from "../redux/medicalSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    medical: medicalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
