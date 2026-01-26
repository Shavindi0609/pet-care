import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../app/DashboardScreen";


const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}
