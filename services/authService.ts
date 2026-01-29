import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile, // මෙමගින් නම update කළ හැක
  updateEmail,
  updatePassword
} from "firebase/auth";


export const registerUser = async (email: string, password: string, fullName: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  // සාර්ථකව account එක සෑදූ පසු නම update කිරීම
  await updateProfile(res.user, { displayName: fullName });
  return res;
};

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// නම update කිරීමට (ඔයා දැනටමත් සාදා ඇති එක)
export const updateUserProfile = async (displayName: string) => {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
    return auth.currentUser;
  }
  throw new Error("No user logged in");
};

// Email update කිරීමට
export const updateEmailAddress = async (newEmail: string) => {
  if (auth.currentUser) {
    await updateEmail(auth.currentUser, newEmail);
  }
};

// Password update කිරීමට
export const updatePasswordValue = async (newPassword: string) => {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  }
};

export const logoutUser = () => signOut(auth);