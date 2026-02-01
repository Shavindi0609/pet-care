import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TextInput, 
  TouchableOpacity, Alert, ScrollView 
} from 'react-native';
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddServiceProviderScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState(""); // Grooming, Vet, Boarding...
  const [image, setImage] = useState(""); // Image URL එකක්

  const handleAddProvider = async () => {
    if (!name || !address || !category) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "service_providers"), {
        name,
        address,
        category, // උදා: "Grooming"
        image: image || "https://api.dicebear.com/7.x/bottts/png?seed=pet",
      });

      Alert.alert("Success", "Provider added successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not add provider");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Add New Provider</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Provider Name (e.g. Mr.Vet)" 
          value={name} onChangeText={setName} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Address" 
          value={address} onChangeText={setAddress} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Category (Grooming / Vet / Boarding)" 
          value={category} onChangeText={setCategory} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Image URL (Optional)" 
          value={image} onChangeText={setImage} 
        />

        <TouchableOpacity style={styles.addBtn} onPress={handleAddProvider}>
          <Text style={styles.addBtnText}>Save Provider</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  form: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#5D4037' },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 10, marginBottom: 15 },
  addBtn: { backgroundColor: '#FF8C00', padding: 18, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default AddServiceProviderScreen;