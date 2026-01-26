import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../app/LoginScreen";
import RegisterScreen from "../app/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
