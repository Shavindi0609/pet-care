import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

// 🔹 Add Pet
export const addPet = async (pet: any) => {
  await addDoc(collection(db, "pets"), pet);
};

// 🔹 Get Pets by user
export const getPets = async (userId: string) => {
  const q = query(
    collection(db, "pets"),
    where("ownerId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 🔹 Delete Pet  ✅ IMPORTANT
export const deletePet = async (petId: string) => {
  await deleteDoc(doc(db, "pets", petId));
};
