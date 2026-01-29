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
import { updateDoc } from "firebase/firestore"; // මේක ඉහළින් import කරගන්න

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

// 🔹 Update Pet (මේක මෙහෙම වෙනස් කරන්න)
export const updatePetInFirestore = async (petId: string, updatedData: any) => {
  const petRef = doc(db, "pets", petId);
  return await updateDoc(petRef, {
    petName: updatedData.name,
    petType: updatedData.type,
    breed: updatedData.breed,
    age: updatedData.age,
    gender: updatedData.gender,
  });
};

// 🔹 Delete Pet  ✅ IMPORTANT
export const deletePet = async (petId: string) => {
  await deleteDoc(doc(db, "pets", petId));
};
