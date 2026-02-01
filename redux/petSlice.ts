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
    // update pet
    updatePet: (state, action: PayloadAction<Pet>) => {
      const index = state.pets.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
    },
    removePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter(
        (pet) => pet.id !== action.payload
      );
    },
  },
});

export const { setPets, addPet, updatePet, removePet } = petSlice.actions;
export default petSlice.reducer;
