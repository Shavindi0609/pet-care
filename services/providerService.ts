import { 
  collection, 
  getDocs, 
  query, 
  where, 
  Firestore 
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Provider {
  id: string;
  name: string;
  address: string;
  image: string;
  category: string; // Grooming, Boarding, etc.
}

// 🔹 Firestore එකෙන් සේවා සපයන්නන් ලබා ගැනීම
export const getProvidersFromFirestore = async (category: string): Promise<Provider[]> => {
  const colRef = collection(db, "service_providers");
  
  // Category එක අනුව filter කරන query එක
  const q = query(colRef, where("category", "==", category));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Provider[];
};