import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Pet Care Dashboard</Text>

      <Text style={styles.email}>Logged in as:</Text>
      <Text style={styles.user}>{user?.email}</Text>

      <Button
        title="Manage Pets"
        onPress={() => navigation.navigate("Pets")}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  user: {
    fontSize: 16,
    marginBottom: 20,
  },
});
