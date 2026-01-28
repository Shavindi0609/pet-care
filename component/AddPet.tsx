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
  ScrollView // අලුතින් එකතු කළා
} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

interface AddPetModalProps {
  isVisible: boolean;
  onClose: () => void;
  petName: string;
  setPetName: (name: string) => void;
}

const AddPetModal = ({ isVisible, onClose, petName, setPetName }: AddPetModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow gallery access to add a pet photo.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Pet Profile</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons name="close-circle" size={30} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* --- Image Picker (දැන් අනිවාර්යයෙන් පෙනේවි) --- */}
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity style={styles.imageCircle} onPress={pickImage}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.petImagePreview} />
                ) : (
                  <View style={styles.placeholderBox}>
                    <MaterialCommunityIcons name="camera-plus" size={40} color="#FF8C00" />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Pet Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What's your pet's name?"
              placeholderTextColor="#A0A0A0"
              value={petName}
              onChangeText={setPetName}
            />

            <Text style={styles.inputLabel}>Pet Type</Text>
            <View style={styles.petTypeRow}>
              {["🐶 Dog", "🐱 Cat", "🐦 Bird"].map((type) => (
                <TouchableOpacity key={type} style={styles.typeChip}>
                  <Text style={styles.typeText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addPetMainBtn} onPress={onClose}>
              <Text style={styles.addPetMainBtnText}>Add Pet Now</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { 
    backgroundColor: "#FFF", 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    padding: 25, 
    maxHeight: '90%', // Screen එකෙන් 90% ක් උස ගන්න පුළුවන්
    minHeight: 500
  },
  handle: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 2.5, alignSelf: 'center', marginBottom: 15 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: "900", color: "#1C1C1E" },
  imagePickerContainer: { alignItems: 'center', marginVertical: 15 },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderStyle: 'dashed',
    overflow: 'hidden'
  },
  petImagePreview: { width: '100%', height: '100%' },
  placeholderBox: { alignItems: 'center' },
  addPhotoText: { fontSize: 13, fontWeight: '700', color: '#FF8C00', marginTop: 5 },
  inputLabel: { fontSize: 16, fontWeight: "700", marginTop: 15, marginBottom: 8, color: "#3A3A3C" },
  input: { backgroundColor: "#F2F2F7", borderRadius: 15, padding: 15, fontSize: 16 },
  petTypeRow: { flexDirection: "row", gap: 10, marginTop: 5 },
  typeChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, backgroundColor: "#F2F2F7" },
  typeText: { fontWeight: '600', fontSize: 15 },
  addPetMainBtn: { backgroundColor: "#FF8C00", padding: 18, borderRadius: 20, marginTop: 30, marginBottom: 20, alignItems: "center" },
  addPetMainBtnText: { color: "#FFF", fontWeight: "800", fontSize: 17 },
});

export default AddPetModal;