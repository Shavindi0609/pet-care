import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pet {
  id: string;
  name: string;
  type: string;
  age?: number;
}

interface PetState {
  pets: Pet[];
}

const initialState: PetState = {
  pets: [],
};

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    removePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter(
        (pet) => pet.id !== action.payload
      );
    },
  },
});

export const { setPets, addPet, removePet } = petSlice.actions;
export default petSlice.reducer;
