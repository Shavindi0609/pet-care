import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Appointment {
  id?: string;
  userId: string;
  petName: string;
  providerName: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: any;
}

// 🔹 Appointment එකක් එක් කිරීම
export const addAppointmentInFirestore = async (appointmentData: Omit<Appointment, 'id'>) => {
  const colRef = collection(db, "appointments");
  return await addDoc(colRef, {
    ...appointmentData,
    createdAt: serverTimestamp(),
  });
};

// 🔹 ලොග් වී සිටින User ගේ සියලුම Appointments ලබා ගැනීම
export const getAppointmentsFromFirestore = async (userId: string): Promise<Appointment[]> => {
  const colRef = collection(db, "appointments");
  const q = query(
    colRef, 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];
};

// 🔹 Appointment එකක් අවලංගු කිරීම (Delete)
export const deleteAppointmentFromFirestore = async (appointmentId: string) => {
  const appRef = doc(db, "appointments", appointmentId);
  return await deleteDoc(appRef);
};

// Appointment එකක් Update කිරීම
export const updateAppointmentInFirestore = async (appointmentId: string, updatedData: Partial<Appointment>) => {
  const appRef = doc(db, "appointments", appointmentId);
  return await updateDoc(appRef, updatedData);
};