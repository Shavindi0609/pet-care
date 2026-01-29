import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  type: string; // Vaccines, Medicine, Vitamins
  status: string;
  clinicName?: string;    // 👈 අලුතින්
  doctorName?: string;    // 👈 අලුතින්
  nextVisitDate?: string; // 👈 අලුතින්
}

interface MedicalState {
  records: MedicalRecord[];
}

const initialState: MedicalState = {
  records: [],
};

const medicalSlice = createSlice({
  name: "medical",
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<MedicalRecord[]>) => {
      state.records = action.payload;
    },
    addRecord: (state, action: PayloadAction<MedicalRecord>) => {
      state.records.push(action.payload);
    },
    updateRecordInState: (state, action: PayloadAction<MedicalRecord>) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    removeRecordFromState: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((r) => r.id !== action.payload);
    },
  },
});

export const { setRecords, addRecord, updateRecordInState, removeRecordFromState } = medicalSlice.actions;
export default medicalSlice.reducer;