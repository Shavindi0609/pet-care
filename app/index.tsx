import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store";
import RootNavigator from "../navigations/RootNavigator";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { setCart, clearCart } from "../redux/cartSlice";
import { getCartFromFirestore } from "../services/cartService";



// ප්‍රධාන App එක ඇතුළේ තවත් Component එකක් හදමු Redux පාවිච්චි කරන්න පුළුවන් වෙන්න
function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // User ලොග් වෙලා ඉන්නවද නැද්ද කියලා බලනවා
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User logged in:", user.uid);
        // 1. Firestore එකෙන් මේ User ගේ Cart එක ගන්නවා
        const savedCart = await getCartFromFirestore(user.uid);
        // 2. ඒක Redux එකට දානවා (දැන් හැම Screen එකකටම පේනවා)
        dispatch(setCart(savedCart));
      } else {
        console.log("User logged out");
        // 3. User අයින් වුණොත් Redux එකේ තියෙන Cart එක මකනවා
        dispatch(clearCart());
      }
    });

    return () => unsubscribe(); // Listener එක අයින් කරනවා
  }, [dispatch]);

  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}