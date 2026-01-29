import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyProfileScreen from "../app/MyProfileScreen";
import ProfileEditScreen from "../app/ProfileEditScreen";
import PetMedicalRecordsScreen from "../app/PetMedicalReportsScreen"; // 👈 අලුත් Screen එක

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={MyProfileScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="PetMedicalRecords" component={PetMedicalRecordsScreen} />
    </Stack.Navigator>
  );
}