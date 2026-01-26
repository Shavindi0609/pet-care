import { useSelector } from "react-redux";
import { RootState } from "../store";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return { user, isLoggedIn: !!user };
};
