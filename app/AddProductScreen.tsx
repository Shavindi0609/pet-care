import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addProductToFirestore } from "../services/shopService";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

const MAIN_ORANGE = "#FF8C00";

const AddProductScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Dog");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  
const categoryColors: { [key: string]: string } = {
  Dog: "#FFE4E6",   // ලා රෝස
  Cat: "#FFF9C4",   // ලා කහ
  Bird: "#E0F2F1",  // ලා නිල්
  Horse: "#EFEBE9", // ලා දුඹුරු
};
  // AddProductScreen.tsx ඇතුළත pickImage function එක

const pickImage = async () => {
    try {
      // Permission ලබා ගැනීම
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "We need access to your gallery.");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: false, // 👈 Error එකක් එනවා නම් මෙය false කර බලන්න
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Could not open gallery.");
    }
  };

  const handleSave = async () => {
    if (!name || !price || !brand || !image) {
      return Alert.alert("Missing Info", "Please fill all fields and select a product image.");
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(image);
      
      if (imageUrl) {
        // 🔥 තෝරාගත් category එකට අදාළ පාට ලබා ගැනීම
        const productCardColor = categoryColors[category] || "#F2F2F7";

        await addProductToFirestore({
          name,
          price: `$ ${price}`,
          brand,
          animalType: category,
          image: imageUrl,
          color: productCardColor, // Database එකට පාට යනවා
        });

        Alert.alert("Success", "Product added successfully! 🎉");
        navigation.goBack();
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please check your connection.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Add New Product</Text>

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={styles.selectedImage} /> : (
              <View style={styles.placeholder}>
                <MaterialCommunityIcons name="camera-plus" size={45} color="#8E8E93" />
                <Text style={styles.placeholderText}>Tap to select product photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.form}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Pedigree" value={name} onChangeText={setName} />

            <Text style={styles.label}>Brand</Text>
            <TextInput style={styles.input} placeholder="e.g.  Royal Canin" value={brand} onChangeText={setBrand} />

            <Text style={styles.label}>Price (USD)</Text>
            <TextInput style={styles.input} placeholder="e.g. 12.66" keyboardType="numeric" value={price} onChangeText={setPrice} />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryRow}>
              {["Dog", "Cat", "Bird", "Horse"].map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.catBtn, category === cat && styles.activeCatBtn]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catBtnText, category === cat && styles.activeCatBtnText]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={uploading}>
              {uploading ? (
                <View style={{ flexDirection: 'row' }}><ActivityIndicator color="#FFF" /><Text style={styles.saveBtnText}> Uploading...</Text></View>
              ) : <Text style={styles.saveBtnText}>Upload & Save Product</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ... (Styles are the same as you provided)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { padding: 20, paddingBottom: 150 },
  title: { fontSize: 26, fontWeight: "900", marginBottom: 25, color: "#1A1A1A" },
  imagePicker: { width: "100%", height: 220, backgroundColor: "#F8F8FA", borderRadius: 25, justifyContent: "center", alignItems: "center", marginBottom: 25, borderWidth: 2, borderColor: "#E5E5EA", borderStyle: "dashed" },
  selectedImage: { width: "100%", height: "100%", borderRadius: 25 },
  placeholder: { alignItems: "center" },
  placeholderText: { marginTop: 12, color: "#8E8E93", fontWeight: "600" },
  form: { width: "100%" },
  label: { fontSize: 15, fontWeight: "700", marginBottom: 8, color: "#444" },
  input: { backgroundColor: "#F2F2F7", padding: 16, borderRadius: 15, marginBottom: 20 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 35 },
  catBtn: { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 25, backgroundColor: "#F2F2F7" },
  activeCatBtn: { backgroundColor: MAIN_ORANGE },
  catBtnText: { color: "#8E8E93", fontWeight: "700" },
  activeCatBtnText: { color: "#FFF" },
  saveBtn: { backgroundColor: MAIN_ORANGE, paddingVertical: 18, borderRadius: 18, alignItems: "center" },
  saveBtnText: { color: "#FFF", fontSize: 18, fontWeight: "800" },
});

export default AddProductScreen;