import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { loginUser } from "../services/authService";
import { setUser } from "../redux/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const res = await loginUser(email, password);
      dispatch(
        setUser({
          uid: res.user.uid,
          email: res.user.email,
        })
      );
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="paw" size={50} color="#FF8C00" />
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.subTitle}>Sign in to continue your pet care journey</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#8E8E93" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Login</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Shadow for iOS/Android
    elevation: 4,
    shadowColor: "#FF8C00",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
  },
  formSection: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#FF8C00",
    fontWeight: "600",
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: "#1C1C1E", // Dashboard එකේ කළු පැහැයට ගැලපෙන සේ
    height: 60,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  loginBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: "#8E8E93",
    fontSize: 15,
  },
  registerText: {
    color: "#FF8C00",
    fontWeight: "700",
    fontSize: 15,
  },
});