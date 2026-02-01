import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Provider {
  id: string;
  name: string;
  address: string;
  image: string;
  category: string; // Grooming, Boarding, Transportation, etc.
}

interface ProviderState {
  providers: Provider[];
  loading: boolean;
}

const initialState: ProviderState = {
  providers: [],
  loading: false,
};

const providerSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    // Firestore එකෙන් ලබාගන්නා සියලුම Providers ලැයිස්තුව State එකට ඇතුළත් කිරීම
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
    },
    // දත්ත Fetch වන අතරතුර පෙන්වන Loading තත්ත්වය පාලනය කිරීම
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // අවශ්‍ය නම් තනි Provider කෙනෙකුගේ විස්තර යාවත්කාලීන කිරීමට
    updateProviderInState: (state, action: PayloadAction<Provider>) => {
      const index = state.providers.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.providers[index] = action.payload;
      }
    },
  },
});

export const { setProviders, setLoading, updateProviderInState } = providerSlice.actions;
export default providerSlice.reducer;