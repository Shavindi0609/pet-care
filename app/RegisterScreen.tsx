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
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { registerUser } from "../services/authService";
import { setUser } from "../redux/authSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(""); // නම සඳහා අලුත් state එකක්
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

 const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // මෙතැනදී fullName එකත් argument එකක් ලෙස ලබා දෙන්න
      const res = await registerUser(email, password, fullName); 
      
      dispatch(
        setUser({
          uid: res.user.uid,
          email: res.user.email,
          displayName: fullName, 
        })
      );
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="account-plus" size={50} color="#FF8C00" />
            </View>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.subTitle}>Join our community and care for your pets</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />
            </View>

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-check-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
              <Text style={styles.registerBtnText}>Register</Text>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 20,
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
    lineHeight: 22,
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
  registerBtn: {
    backgroundColor: "#FF8C00",
    height: 60,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#FF8C00",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  registerBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 17,
  },
  footerText: {
    color: "#8E8E93",
    fontSize: 15,
  },
  loginText: {
    color: "#FF8C00",
    fontWeight: "700",
    fontSize: 15,
  },
});