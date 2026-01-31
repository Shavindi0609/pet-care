import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 1. Cart එක Save කිරීම (User ID එක යටතේ)
export const saveCartToFirestore = async (userId: string, cartItems: any[]) => {
  try {
    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, { items: cartItems, updatedAt: new Date() });
  } catch (error) {
    console.error("Cart save error:", error);
  }
};

// 2. Cart එක ලබාගැනීම
export const getCartFromFirestore = async (userId: string) => {
  try {
    const cartRef = doc(db, "carts", userId);
    const docSnap = await getDoc(cartRef);
    if (docSnap.exists()) {
      return docSnap.data().items;
    }
    return [];
  } catch (error) {
    console.error("Cart fetch error:", error);
    return [];
  }
};