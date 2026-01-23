// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWO89MoFua2xoqh4U05f6bzvOBU0F3xn0",
  authDomain: "pet-care-app-3a807.firebaseapp.com",
  projectId: "pet-care-app-3a807",
  storageBucket: "pet-care-app-3a807.firebasestorage.app",
  messagingSenderId: "966578616951",
  appId: "1:966578616951:web:7245312c4908590b922472",
  measurementId: "G-NXQW6P72CP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);