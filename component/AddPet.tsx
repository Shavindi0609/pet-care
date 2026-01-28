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

// Props Interface එක හරියටම මෙහෙම හදමු
interface AddPetModalProps {
  isVisible: boolean;
  onClose: () => void;
  petName: string;
  setPetName: (name: string) => void;
  // Dashboard එකට data යවන අලුත් function එක
  onAddPet: (name: string, image: string | null) => void; 
}

const AddPetModal = ({ isVisible, onClose, petName, setPetName, onAddPet }: AddPetModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission Needed', 'Please allow gallery access to add a pet photo.');
    return;
  }

  try {
// කලින් තිබුණේ: mediaTypes: ImagePicker.MediaTypeOptions.Images
// අලුත් ක්‍රමය:
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'], // මේ විදියට array එකක් ලෙස ලබා දෙන්න
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5,
});

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  } catch (error) {
    console.error("Picker Error:", error);
    Alert.alert("Error", "Something went wrong while picking the image.");
  }
};

  // පින්තූරය සහ නම යවන function එක
  const handleAddPetAction = () => {
    if (petName.trim() === "") {
      Alert.alert("Error", "Please enter a pet name");
      return;
    }
    // Dashboard එකේ තියෙන ලැයිස්තුවට එකතු කරනවා
    onAddPet(petName, selectedImage); 
    // Data reset කරනවා ඊළඟ වතාවට
    setSelectedImage(null);
    setPetName("");
    onClose();
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

            {/* Image Picker Section */}
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

            {/* මෙතනින් තමයි dashboard එකට data යවන්නේ */}
            <TouchableOpacity style={styles.addPetMainBtn} onPress={handleAddPetAction}>
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
    maxHeight: '90%', 
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