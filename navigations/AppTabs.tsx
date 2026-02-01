import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DashboardScreen from "../app/DashboardScreen";
import ShopScreen from "@/app/ShopScreen";
// import MyProfileScreen from "@/app/MyProfileScreen";
import ProfileStack from "./ProfileStack";
import ShopStack from "./ShopStack"; 
import ServiceDetailsScreen from "@/app/ServiceDetailsScreen";
import ServiceStack from "./ServiceStack"; // 👈 අලුතින් import කරන්න

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          height: 100,
          paddingBottom: 10,
          paddingTop: 10,
          // මේ කොටසින් Tab Bar එක උඩට ගෙන එයි
          position: 'absolute',
          bottom: 0,          // මෙතනින් කැමති ප්‍රමාණයට උඩට ගන්න පුළුවන්
          left: 20,            // වම් පැත්තෙන් ඉඩ තැබීමට
          right: 20,           // දකුණු පැත්තෙන් ඉඩ තැබීමට
          borderRadius: 30,    // සම්පූර්ණයෙන්ම වටකුරු වීමට
          // Shadow/Elevation ලස්සනට පේන්න
          backgroundColor: '#FFFFFF',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          borderTopWidth: 0,   // උඩින් තියෙන සිහින් රේඛාව අයින් කිරීමට
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={28} />
          ),
        }}
      />
        <Tab.Screen 
          name="Shop" 
          component={ShopStack} 
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cart-outline" color={color} size={28} />
            ),
          }}
        />
    
      <Tab.Screen 
      name="Services" 
      component={ServiceStack} // 👈 මෙතනට Stack එක දෙන්න
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="content-cut" color={color} size={28} />
        ),
      }}
    />

      <Tab.Screen 
        name="Socialise" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="monitor-screenshot" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen 
        name="My Profile" 
        component={ProfileStack} // 👈 මෙතනට ProfileStack එක දෙන්න
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="paw-outline" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}