import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PetMedicalRecordsScreen = ({ navigation, route }: any) => {
  // Pet ගේ නම තිබේ නම් එය පෙන්වීමට (උදා: Luna)
  const petName = route.params?.petName || "Pet";

  const [activeTab, setActiveTab] = useState("Vaccines");

  // Sample data (පසුව Firebase සමඟ සම්බන්ධ කළ හැක)
  const [records, setRecords] = useState({
    Vaccines: [{ id: 1, title: "Rabies", date: "2024-01-10", status: "Completed" }],
    Medicine: [{ id: 1, title: "Heartworm", date: "2024-02-01", status: "Ongoing" }],
    Vitamins: [{ id: 1, title: "Omega 3", date: "Daily", status: "Ongoing" }],
  });

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
      <Text style={[styles.tabText, activeTab === name && styles.activeTabText]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{petName}'s Records</Text>
        <TouchableOpacity onPress={() => Alert.alert("Add Record", `Add new ${activeTab}`)}>
          <MaterialCommunityIcons name="plus-circle" size={30} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton("Vaccines", "needle")}
        {renderTabButton("Medicine", "pill")}
        {renderTabButton("Vitamins", "bottle-tonic-plus")}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{activeTab} History</Text>
        
        {records[activeTab as keyof typeof records].map((item) => (
          <View key={item.id} style={styles.recordCard}>
            <View style={styles.recordInfo}>
              <Text style={styles.recordTitle}>{item.title}</Text>
              <Text style={styles.recordDate}>{item.date}</Text>
            </View>
            <View style={[styles.statusBadge, item.status === "Completed" ? styles.bgSuccess : styles.bgWarning]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}

        {/* Empty State */}
        {records[activeTab as keyof typeof records].length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#E0E0E0" />
            <Text style={styles.emptyText}>No records found for {activeTab}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1C1C1E" },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#F2F2F7",
  },
  activeTab: { backgroundColor: "#FFF5E6", borderWidth: 1, borderColor: "#FF8C00" },
  tabText: { fontSize: 12, color: "#8E8E93", marginTop: 5, fontWeight: "600" },
  activeTabText: { color: "#FF8C00" },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1C1C1E", marginBottom: 15 },
  recordCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F2F2F7",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  recordInfo: { flex: 1 },
  recordTitle: { fontSize: 16, fontWeight: "700", color: "#1C1C1E" },
  recordDate: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  bgSuccess: { backgroundColor: "#E8F5E9" },
  bgWarning: { backgroundColor: "#FFF3E0" },
  statusText: { fontSize: 11, fontWeight: "700", color: "#2E7D32" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#AEAEB2", marginTop: 10 },
});

export default PetMedicalRecordsScreen;