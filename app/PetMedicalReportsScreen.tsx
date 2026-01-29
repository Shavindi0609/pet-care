import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  SafeAreaView, Modal, TextInput, Alert, ActivityIndicator,
  Platform, KeyboardAvoidingView, ScrollView
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
  
  // Input States
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [nextVisit, setNextVisit] = useState("");

  // 1. Fetch Records Real-time
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
    if (!title || !date) return Alert.alert("Error", "Please fill essential fields");

    try {
      const data: any = { 
        title, 
        date, 
        type: activeTab, 
        status: "Completed",
        // VET Visits නම් විතරක් මේ දත්ත එකතු කරන්න
        ...(activeTab === "VET Visits" && { 
            clinicName: clinicName || "N/A", 
            nextVisitDate: nextVisit || "Not set" 
        })
      };

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
    Alert.alert("Remove Record", "Are you sure you want to delete this history?", [
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
      setClinicName(item.clinicName || "");
      setNextVisit(item.nextVisitDate || "");
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setClinicName("");
    setNextVisit("");
    setModalVisible(false);
  };

  const renderTabButton = (name: string, icon: any) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === name && styles.activeTab]}
      onPress={() => setActiveTab(name)}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={22} 
        color={activeTab === name ? "#FF8C00" : "#8E8E93"} 
      />
      <Text style={[styles.tabText, activeTab === name && styles.activeTabText]}>{name}</Text>
    </TouchableOpacity>
  );

  const filteredRecords = records.filter(r => r.type === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{petName}'s History</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton("VET Visits", "doctor")}
        {renderTabButton("Vaccines", "needle")}
        {renderTabButton("Medicine", "pill")}
       
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
                <View style={styles.dateRow}>
                   <MaterialCommunityIcons name="calendar-check" size={14} color="#8E8E93" />
                   <Text style={styles.recordDate}>{item.date}</Text>
                </View>
                
                {activeTab === "VET Visits" && item.clinicName && (
                  <View style={styles.extraInfoContainer}>
                    <Text style={styles.subInfoText}><MaterialCommunityIcons name="hospital-building" size={12}/> {item.clinicName}</Text>
                    {item.nextVisitDate && (
                       <Text style={styles.nextVisitText}><MaterialCommunityIcons name="bell-ring" size={12}/> Next: {item.nextVisitDate}</Text>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => openModal(item)} style={styles.iconCircle}>
                  <MaterialCommunityIcons name="pencil" size={18} color="#FF8C00" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.iconCircle, {backgroundColor: '#FFF5F5'}]}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#F2F2F7" />
               <Text style={styles.emptyText}>No {activeTab} records yet.</Text>
            </View>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
               <Text style={styles.modalHeader}>{editingId ? "Update" : "New"} {activeTab}</Text>
               <TouchableOpacity onPress={closeModal}>
                  <MaterialCommunityIcons name="close" size={24} color="#8E8E93" />
               </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>{activeTab === "VET Visits" ? "Reason for visit" : "Record Title"}</Text>
                <TextInput 
                placeholder="e.g. Annual Checkup / Parvo Vaccine" 
                style={styles.input} 
                value={title}
                onChangeText={setTitle}
                />

                <Text style={styles.inputLabel}>Date</Text>
                <TextInput 
                placeholder="YYYY-MM-DD" 
                style={styles.input} 
                value={date}
                onChangeText={setDate}
                />

                {activeTab === "VET Visits" && (
                <>
                    <Text style={styles.inputLabel}>Clinic / Doctor Name</Text>
                    <TextInput 
                    placeholder="Happy Paws Clinic" 
                    style={styles.input} 
                    value={clinicName}
                    onChangeText={setClinicName}
                    />

                    <Text style={styles.inputLabel}>Next Visit Reminder (Optional)</Text>
                    <TextInput 
                    placeholder="YYYY-MM-DD" 
                    style={styles.input} 
                    value={nextVisit}
                    onChangeText={setNextVisit}
                    />
                </>
                )}

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveRecord}>
                <Text style={styles.saveBtnText}>{editingId ? "Update Record" : "Save Record"}</Text>
                </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFCFF" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 20,
    backgroundColor: '#FFF'
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1C1C1E" },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FF8C00', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  
  tabContainer: { flexDirection: "row", paddingHorizontal: 15, marginVertical: 15 },
  tabButton: { flex: 1, alignItems: "center", paddingVertical: 12, backgroundColor: "#F2F2F7", borderRadius: 16, marginHorizontal: 4 },
  activeTab: { backgroundColor: "#FFF5E6", borderWidth: 1, borderColor: "#FF8C00" },
  tabText: { fontSize: 11, color: "#8E8E93", marginTop: 4, fontWeight: '600' },
  activeTabText: { color: "#FF8C00", fontWeight: "700" },

  listPadding: { paddingHorizontal: 20, paddingBottom: 100 },
  recordCard: { 
    flexDirection: "row", 
    backgroundColor: "#FFF", 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: "#F2F2F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2 
  },
  recordInfo: { flex: 1 },
  recordTitle: { fontSize: 16, fontWeight: "700", color: "#1C1C1E", marginBottom: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  recordDate: { fontSize: 13, color: "#8E8E93" },
  
  extraInfoContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  subInfoText: { fontSize: 13, color: '#636366', marginBottom: 2 },
  nextVisitText: { fontSize: 13, color: '#FF8C00', fontWeight: '600' },

  actionIcons: { flexDirection: "row", gap: 10, alignItems: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF9F0', justifyContent: 'center', alignItems: 'center' },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: "center", color: "#AEAEB2", marginTop: 15, fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalHeader: { fontSize: 20, fontWeight: "800", color: '#1C1C1E' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: "#F2F2F7", padding: 15, borderRadius: 12, fontSize: 15, color: '#1C1C1E' },
  saveBtn: { backgroundColor: "#FF8C00", paddingVertical: 16, borderRadius: 15, marginTop: 30, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default PetMedicalRecordsScreen;