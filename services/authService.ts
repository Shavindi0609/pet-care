import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile, // මෙමගින් නම update කළ හැක
} from "firebase/auth";

export const registerUser = async (email: string, password: string, fullName: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  // සාර්ථකව account එක සෑදූ පසු නම update කිරීම
  await updateProfile(res.user, { displayName: fullName });
  return res;
};

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);