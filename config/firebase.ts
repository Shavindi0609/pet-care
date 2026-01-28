import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDWO89MoFua2xoqh4U05f6bzvOBU0F3xn0",
  authDomain: "pet-care-app-3a807.firebaseapp.com",
  projectId: "pet-care-app-3a807",
  storageBucket: "pet-care-app-3a807.firebasestorage.app",
  messagingSenderId: "966578616951",
  appId: "1:966578616951:web:7245312c4908590b922472",
  measurementId: "G-NXQW6P72CP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
