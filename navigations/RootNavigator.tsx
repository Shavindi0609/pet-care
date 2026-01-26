import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import { useAuth } from "../hooks/useAuth";

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AppTabs /> : <AuthStack />;
}
