import { db } from "../config/firebase";
import { 
  collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp 
} from "firebase/firestore";

const productCol = collection(db, "products");

// 1. Save Product
export const addProductToFirestore = async (productData: any) => {
  try {
    await addDoc(productCol, {
      ...productData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// 2. Real-time Fetch (මෙය ShopScreen එකේ පාවිච්චි කරන්න)
// services/shopService.ts

export const subscribeToProducts = (category: string, callback: (products: any[]) => void) => {
  let q = query(productCol, orderBy("createdAt", "desc"));
  
  if (category !== "All") {
    q = query(productCol, where("animalType", "==", category), orderBy("createdAt", "desc"));
  }

  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        // මෙතනදී data.createdAt තියෙනවාද කියලා මුලින්ම බලනවා
        createdAt: data.createdAt && data.createdAt.toDate 
                   ? data.createdAt.toDate().toISOString() 
                   : new Date().toISOString() // null නම් දැනට තියෙන වෙලාව දානවා
      };
    });
    callback(products);
  });
};