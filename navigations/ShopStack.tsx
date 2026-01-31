import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from "../app/ShopScreen";
import AddProductScreen from "../app/AddProductScreen";
import ProductDetailsScreen from "@/app/ProductDetailsScreen";
import CartScreen from "@/app/CartScreen"; // අලුතින් හදපු CartScreen එක import කරන්න

const Stack = createNativeStackNavigator();

export default function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Shop Main Screen */}
      <Stack.Screen name="ShopMain" component={ShopScreen} />
      
      {/* 2. Add Product Screen */}
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen} 
        options={{ headerShown: true, title: "Add New Product" }} 
      />

      {/* 3. Product Details Screen */}
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
      />

      {/* 4. Cart Screen - මෙය අනිවාර්යයෙන්ම ඇතුළත් කරන්න */}
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ headerShown: false }} 
      />

    </Stack.Navigator>
  );
}