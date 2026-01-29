import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../config/firebase";
import { MedicalRecord } from "../redux/medicalSlice";

// 🔹 Add Record
export const addMedicalRecordInFirestore = async (petId: string, recordData: Omit<MedicalRecord, 'id'>) => {
  const colRef = collection(db, "pets", petId, "medical_records");
  return await addDoc(colRef, {
    ...recordData,
    createdAt: serverTimestamp(),
  });
};

// 🔹 Get Records (Real-time නෙවෙයි නම් මේක පාවිච්චි කරන්න පුළුවන්)
export const getMedicalRecordsFromFirestore = async (petId: string): Promise<MedicalRecord[]> => {
  const colRef = collection(db, "pets", petId, "medical_records");
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MedicalRecord[];
};

// 🔹 Update Record
export const updateMedicalRecordInFirestore = async (petId: string, recordId: string, updatedData: Partial<MedicalRecord>) => {
  const recordRef = doc(db, "pets", petId, "medical_records", recordId);
  return await updateDoc(recordRef, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
};

// 🔹 Delete Record
export const deleteMedicalRecordFromFirestore = async (petId: string, recordId: string) => {
  const recordRef = doc(db, "pets", petId, "medical_records", recordId);
  return await deleteDoc(recordRef);
};