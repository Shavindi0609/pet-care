import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceDetailsScreen from "../app/ServiceDetailsScreen";
import AddAppointmentScreen from "../app/AddAppointmentScreen"; // 👈 අලුත් screen එක
import ServiceProvidersScreen from "../app/ServiceProvidersScreen";
import ServiceMenuScreen from '../app/ServiceMenuScreen';

const Stack = createNativeStackNavigator();

export default function ServiceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* මුලින්ම පෙන්වන්නේ default විස්තර සහිත screen එක */}
      <Stack.Screen 
        name="ServiceMain" 
        component={ServiceDetailsScreen} 
        initialParams={{ 
          serviceName: "Pet Services", 
          icon: "paw", 
          subText: "General Care" 
        }} 
      />
      {/* Appointment එක ඇතුළත් කරන screen එක */}
      <Stack.Screen name="ServiceMenu" component={ServiceMenuScreen} />
      <Stack.Screen name="ServiceProviders" component={ServiceProvidersScreen} />
      {/* Appointment screen එක මෙතැනින් පෙන්වයි */}
      <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
    </Stack.Navigator>
  );
}