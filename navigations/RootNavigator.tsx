import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import AskFidoScreen from "../app/AskFidoScreen"; // 👈 ඔයා හදපු අලුත් Screen එක
import { useAuth } from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // ලොග් වී ඇත්නම් මුලින්ම AppTabs පෙන්වනවා
        <>
          <Stack.Screen name="MainTabs" component={AppTabs} />
          <Stack.Screen name="AskFido" component={AskFidoScreen} />
        </>
      ) : (
        // ලොග් වී නැත්නම් AuthStack එක පෙන්වනවා
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}