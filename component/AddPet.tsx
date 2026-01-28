import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert,
  ScrollView 
} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

interface AddPetModalProps {
  isVisible: boolean;
  onClose: () => void;
  // Dashboard එකට සියලුම දත්ත යවන function එක
  onAddPet: (petData: any) => void; 
}

const AddPetModal = ({ isVisible, onClose, onAddPet }: AddPetModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [selectedType, setSelectedType] = useState("🐶 Dog");
  const [gender, setGender] = useState("Male");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow gallery access.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick the image.");
    }
  };

  const handleAddPetAction = () => {
    if (petName.trim() === "" || breed.trim() === "" || age.trim() === "") {
      Alert.alert("Error", "Please fill all the details");
      return;
    }

    // සියලුම දත්ත object එකක් ලෙස යවමු
    onAddPet({
      name: petName,
      type: selectedType,
      breed: breed,
      age: age,
      gender: gender,
      image: selectedImage
    }); 

    // Reset fields
    setSelectedImage(null);
    setPetName("");
    setBreed("");
    setAge("");
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Pet Profile</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons name="close-circle" size={30} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* Image Picker */}
            <TouchableOpacity style={styles.imageCircle} onPress={pickImage}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.petImagePreview} />
              ) : (
                <View style={styles.placeholderBox}>
                  <MaterialCommunityIcons name="camera-plus" size={35} color="#FF8C00" />
                  <Text style={styles.addPhotoText}>Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Pet Type Row */}
            <View style={styles.petTypeRow}>
              {["🐶 Dog", "🐱 Cat", "🐦 Bird"].map((type) => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.typeChip, selectedType === type && styles.activeChip]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.typeText, selectedType === type && styles.activeText]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Pet Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Buddy" value={petName} onChangeText={setPetName} />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.inputLabel}>Breed</Text>
                <TextInput style={styles.input} placeholder="e.g. Persian" value={breed} onChangeText={setBreed} />
              </View>
              <View style={{ width: 100 }}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput style={styles.input} placeholder="Years" keyboardType="numeric" value={age} onChangeText={setAge} />
              </View>
            </View>

            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.petTypeRow}>
              {["Male", "Female"].map((g) => (
                <TouchableOpacity 
                  key={g} 
                  style={[styles.genderChip, gender === g && styles.activeChip]}
                  onPress={() => setGender(g)}
                >
                  <MaterialCommunityIcons 
                    name={g === "Male" ? "gender-male" : "gender-female"} 
                    size={20} 
                    color={gender === g ? "#FFF" : "#3A3A3C"} 
                  />
                  <Text style={[styles.typeText, gender === g && styles.activeText, { marginLeft: 5 }]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addPetMainBtn} onPress={handleAddPetAction}>
              <Text style={styles.addPetMainBtnText}>Create Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, maxHeight: '90%' },
  handle: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 2.5, alignSelf: 'center', marginBottom: 15 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: "900", color: "#1C1C1E" },
  imageCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F9F9F9', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FF8C00', borderStyle: 'dashed', overflow: 'hidden', marginBottom: 20 },
  petImagePreview: { width: '100%', height: '100%' },
  placeholderBox: { alignItems: 'center' },
  addPhotoText: { fontSize: 12, fontWeight: '700', color: '#FF8C00' },
  inputLabel: { fontSize: 15, fontWeight: "700", marginTop: 15, marginBottom: 8, color: "#3A3A3C" },
  input: { backgroundColor: "#F2F2F7", borderRadius: 12, padding: 12, fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
  petTypeRow: { flexDirection: "row", gap: 10, marginTop: 5 },
  typeChip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, backgroundColor: "#F2F2F7", flex: 1, alignItems: 'center' },
  genderChip: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: "#F2F2F7", flex: 1, alignItems: 'center', justifyContent: 'center' },
  activeChip: { backgroundColor: "#FF8C00" },
  typeText: { fontWeight: '600', fontSize: 14, color: '#3A3A3C' },
  activeText: { color: "#FFF" },
  addPetMainBtn: { backgroundColor: "#FF8C00", padding: 16, borderRadius: 18, marginTop: 30, marginBottom: 20, alignItems: "center" },
  addPetMainBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
});

export default AddPetModal;