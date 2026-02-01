import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Appointment {
  id?: string;
  userId: string;
  petName: string;
  providerName: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addAppointmentToState: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
  },
});

export const { setLoading, addAppointmentToState } = appointmentSlice.actions;
export default appointmentSlice.reducer;