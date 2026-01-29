import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  SafeAreaView, Modal, TextInput, Alert, ActivityIndicator
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../config/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { 
  addMedicalRecordInFirestore, 
  updateMedicalRecordInFirestore, 
  deleteMedicalRecordFromFirestore 
} from "../services/medicalService";

const PetMedicalRecordsScreen = ({ navigation, route }: any) => {
  const { petId, petName } = route.params;
  const [activeTab, setActiveTab] = useState("Vaccines");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  // 1. Fetch Records Real-time (MyProfileScreen එකේ pets වගේමයි)
  useEffect(() => {
    const q = query(
      collection(db, "pets", petId, "medical_records"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordsArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(recordsArray);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [petId]);

  // 2. Add or Update Handler
  const handleSaveRecord = async () => {
    if (!title || !date) return Alert.alert("Error", "Please fill all fields");

    try {
      const data = { title, date, type: activeTab, status: "Ongoing" };

      if (editingId) {
        await updateMedicalRecordInFirestore(petId, editingId, data);
        Alert.alert("Updated", "Record updated successfully! ✨");
      } else {
        await addMedicalRecordInFirestore(petId, data);
        Alert.alert("Success", "New record added! 🐾");
      }
      closeModal();
    } catch (error) {
      Alert.alert("Error", "Could not save the record.");
    }
  };

  // 3. Delete Handler
  const handleDelete = (id: string) => {
    Alert.alert("Remove Record", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          await deleteMedicalRecordFromFirestore(petId, id);
        }
      }
    ]);
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setDate(item.date);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setModalVisible(false);
  };

  const renderTabButton = (name: string, icon: any) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === name && styles.activeTab]}
      onPress={() => setActiveTab(name)}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={activeTab === name ? "#FF8C00" : "#8E8E93"} 
      />
      <Text style={[styles.tabText, activeTab === name && styles.activeTabText]}>{name}</Text>
    </TouchableOpacity>
  );

  const filteredRecords = records.filter(r => r.type === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{petName}'s Records</Text>
        <TouchableOpacity onPress={() => openModal()}>
          <MaterialCommunityIcons name="plus-circle" size={30} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton("Vaccines", "needle")}
        {renderTabButton("Medicine", "pill")}
        {renderTabButton("Vitamins", "bottle-tonic-plus")}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <View style={styles.recordCard}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{item.title}</Text>
                <Text style={styles.recordDate}>{item.date}</Text>
              </View>
              <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => openModal(item)}>
                  <MaterialCommunityIcons name="pencil-outline" size={22} color="#FF8C00" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No {activeTab} history found.</Text>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{editingId ? "Edit" : "Add"} {activeTab}</Text>
            <TextInput 
              placeholder="Record Title" 
              style={styles.input} 
              value={title}
              onChangeText={setTitle}
            />
            <TextInput 
              placeholder="Date (e.g., 2024-05-20)" 
              style={styles.input} 
              value={date}
              onChangeText={setDate}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveRecord}><Text style={{color:'#FFF'}}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  tabContainer: { flexDirection: "row", paddingHorizontal: 15, marginBottom: 15 },
  tabButton: { flex: 1, alignItems: "center", paddingVertical: 12, backgroundColor: "#F2F2F7", borderRadius: 15, marginHorizontal: 5 },
  activeTab: { backgroundColor: "#FFF5E6", borderWidth: 1, borderColor: "#FF8C00" },
  tabText: { fontSize: 11, color: "#8E8E93", marginTop: 4 },
  activeTabText: { color: "#FF8C00", fontWeight: "700" },
  listPadding: { paddingHorizontal: 20, paddingBottom: 20 },
  recordCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF", padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: "#F2F2F7", elevation: 1 },
  recordInfo: { flex: 1 },
  recordTitle: { fontSize: 16, fontWeight: "700" },
  recordDate: { fontSize: 13, color: "#8E8E93" },
  actionIcons: { flexDirection: "row", gap: 15 },
  emptyText: { textAlign: "center", color: "#AEAEB2", marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#FFF", borderRadius: 20, padding: 20 },
  modalHeader: { fontSize: 18, fontWeight: "800", marginBottom: 15 },
  input: { backgroundColor: "#F2F2F7", padding: 12, borderRadius: 10, marginBottom: 10 },
  modalBtnRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  cancelBtn: { padding: 12 },
  saveBtn: { backgroundColor: "#FF8C00", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10 },
});

export default PetMedicalRecordsScreen;