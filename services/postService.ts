import { db } from "../config/firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

export interface Post {
  id?: string;
  user: string;
  pet: string;
  image: string;
  status: string;
  likes: number;
  createdAt?: any;
}

const postsRef = collection(db, "posts");

// පෝස්ට් එකක් Firestore එකට එකතු කිරීම
export const addPostToFirestore = async (postData: Omit<Post, 'id' | 'likes' | 'createdAt'>) => {
  return await addDoc(postsRef, {
    ...postData,
    likes: 0,
    createdAt: serverTimestamp(),
  });
};

// සියලුම පෝස්ට් ලබා ගැනීම
export const getPostsFromFirestore = async (): Promise<Post[]> => {
  const q = query(postsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};