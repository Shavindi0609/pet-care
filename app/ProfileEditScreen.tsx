import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setUser } from "../redux/authSlice";
import { updateUserProfile, updateEmailAddress, updatePasswordValue } from "../services/authService"; // මේ අලුත් functions පහත පියවරේදී හදමු
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../config/firebase"; // ඔයාගේ firebase config file එක තියෙන path එක දෙන්න

const ProfileEditScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [fullName, setFullName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(""); // Password එක සාමාන්‍යයෙන් කලින් පෙන්වන්නේ නැත
  const [loading, setLoading] = useState(false);

const handleUpdate = async () => {
  if (!fullName.trim() || !email.trim()) {
    Alert.alert("Error", "Name and Email cannot be empty");
    return;
  }

  setLoading(true);
  try {
    if (fullName !== user?.displayName) {
      await updateUserProfile(fullName);
    }

    if (email !== user?.email) {
      await updateEmailAddress(email);
    }

    if (password.length > 0) {
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      await updatePasswordValue(password);
    }
    
    // 🔥 මෙතන තමයි වෙනස තියෙන්නේ
    const currentUid = user?.uid || auth.currentUser?.uid;

    if (currentUid) {
      dispatch(
        setUser({
          uid: currentUid,
          displayName: fullName,
          email: email,
        })
      );
      Alert.alert("Success", "Profile updated successfully! 🐾");
      navigation.goBack();
    } else {
      throw new Error("User session not found. Please login again.");
    }

  } catch (error: any) {
    Alert.alert("Update Failed", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={30} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.avatarSection}>
             <View style={styles.avatar}>
                <Text style={styles.avatarText}>{fullName.charAt(0).toUpperCase()}</Text>
             </View>
          </View>

          {/* Full Name Input */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={20} color="#8E8E93" />
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your name"
            />
          </View>

          {/* Email Input */}
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#8E8E93" />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.label}>New Password (Optional)</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#8E8E93" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Leave empty to keep same"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// ... Styles කලින් තිබූ ඒවාම පාවිච්චි කළ හැක

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 40 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  content: { padding: 25 },
  avatarSection: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#FF8C00", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#FFF", fontSize: 30, fontWeight: "bold" },
  label: { fontSize: 14, color: "#8E8E93", marginBottom: 8, fontWeight: "600" },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#F2F2F7", 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 55,
    marginBottom: 30 
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  saveBtn: { backgroundColor: "#FF8C00", height: 55, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" }
});

export default ProfileEditScreen;