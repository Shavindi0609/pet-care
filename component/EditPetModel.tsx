import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface EditPetModalProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  petData: any; // Edit කරන්න තෝරාගත් සතාගේ දත්ත
}

const EditPetModal = ({ isVisible, onClose, onUpdate, petData }: EditPetModalProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // Modal එක open වෙද්දී පරණ දත්ත TextInput වලට දාගන්නවා
  useEffect(() => {
    if (petData) {
      setName(petData.petName || "");
      setType(petData.petType || "");
      setBreed(petData.breed || "");
      setAge(petData.age?.toString() || "");
      setGender(petData.gender || "");
    }
  }, [petData, isVisible]);

  const handleUpdate = () => {
    if (!name || !type) return;
    onUpdate({ name, type, breed, age, gender });
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.modalContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Edit Pet Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Pet Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Pet Type (e.g. Dog 🐶)</Text>
            <TextInput style={styles.input} value={type} onChangeText={setType} />

            <Text style={styles.label}>Breed</Text>
            <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Age</Text>
                <TextInput style={styles.input} value={age} keyboardType="numeric" onChangeText={setAge} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Gender</Text>
                <TextInput style={styles.input} value={gender} onChangeText={setGender} />
              </View>
            </View>

            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
              <Text style={styles.updateBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: "80%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "800", color: "#1C1C1E" },
  label: { fontSize: 14, fontWeight: "600", color: "#8E8E93", marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: "#F2F2F7", borderRadius: 12, padding: 15, fontSize: 16, color: "#1C1C1E" },
  row: { flexDirection: "row" },
  updateBtn: { backgroundColor: "#FF8C00", borderRadius: 15, padding: 18, alignItems: "center", marginTop: 30, marginBottom: 20 },
  updateBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});

export default EditPetModal;