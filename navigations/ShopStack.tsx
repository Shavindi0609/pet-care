import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from "../app/ShopScreen";
import AddProductScreen from "../app/AddProductScreen";
// import CartScreen from "../app/CartScreen"; // ඔයා හදපු Cart Screen එක

const Stack = createNativeStackNavigator();

export default function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* මුලින්ම පෙන්විය යුතු Screen එක */}
      <Stack.Screen name="ShopMain" component={ShopScreen} />
      
      {/* Shop එක ඇතුළේ යන අනෙකුත් Screens */}
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen} 
        options={{ headerShown: true, title: "Add New Product" }} 
      />
      {/* <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ headerShown: true, title: "My Cart" }} 
      /> */}
    </Stack.Navigator>
  );
}