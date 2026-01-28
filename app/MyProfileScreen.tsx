import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform
} from "react-native";
import { db, auth } from "../config/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const MyProfileScreen = ({ navigation }: any) => {
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "pets"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsArray: any[] = [];
      querySnapshot.forEach((doc) => {
        // මෙහිදී Firestore හි ඇති සියලුම data (...doc.data()) ලබාගන්නවා
        petsArray.push({ id: doc.id, ...doc.data() });
      });
      setPets(petsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleDeletePet = (id: string, name: string) => {
    Alert.alert(
      "Remove Pet",
      `Are you sure you want to remove ${name} from your family?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "pets", id));
            } catch (error) {
              Alert.alert("Error", "Could not delete pet profile.");
            }
          } 
        },
      ]
    );
  };

  const renderPetItem = ({ item }: { item: any }) => (
    <View style={styles.petCard}>
      {/* Pet Image Section */}
      <View style={styles.imageContainer}>
        {item.petImage ? (
          <Image source={{ uri: item.petImage }} style={styles.petImage} />
        ) : (
          <View style={styles.placeholderImg}>
            <MaterialCommunityIcons name="paw" size={50} color="#DDD" />
          </View>
        )}
        {/* Pet Type Badge (Dog/Cat emoji) */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.petType?.split(' ')[0] || "🐾"}</Text>
        </View>
      </View>
      
      <View style={styles.petDetails}>
        <View style={styles.nameRow}>
          <Text style={styles.petName} numberOfLines={1}>{item.petName}</Text>
          <MaterialCommunityIcons 
            name={item.gender === "Male" ? "gender-male" : "gender-female"} 
            size={18} 
            color={item.gender === "Male" ? "#2196F3" : "#F06292"} 
          />
        </View>

        {/* Breed Description */}
        <Text style={styles.breedText} numberOfLines={1}>
          {item.breed || "Unknown Breed"}
        </Text>

        {/* Age & Gender Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.ageTag}>
            <Text style={styles.ageText}>{item.age} Years</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionCircle}>
            <MaterialCommunityIcons name="pencil" size={16} color="#FF8C00" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionCircle, { backgroundColor: '#FFF0F0' }]} 
            onPress={() => handleDeletePet(item.id, item.petName)}
          >
            <MaterialCommunityIcons name="trash-can" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topPadding} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Pet Family</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {pets.length > 0 ? (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPetItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="paw-off" size={80} color="#E0E0E0" />
          <Text style={styles.emptyText}>No pets added yet!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9FB" },
  topPadding: { height: Platform.OS === 'android' ? StatusBar.currentHeight : 0, marginTop: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 15 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#1C1C1E" },
  listContent: { paddingHorizontal: 10, paddingBottom: 30 },
  petCard: {
    backgroundColor: "#FFF",
    width: (width / 2) - 20,
    margin: 10,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  imageContainer: { width: '100%', height: 130 },
  petImage: { width: "100%", height: "100%" },
  placeholderImg: { width: "100%", height: "100%", backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  typeBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: 4 },
  typeBadgeText: { fontSize: 14 },
  petDetails: { padding: 12 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  petName: { fontSize: 16, fontWeight: "800", color: "#1C1C1E", flex: 1 },
  breedText: { fontSize: 12, color: "#8E8E93", fontWeight: "600", marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ageTag: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  ageText: { fontSize: 10, color: '#E65100', fontWeight: '800' },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionCircle: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FDF7F0', justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100 },
  emptyText: { fontSize: 16, color: "#8E8E93", marginTop: 15, fontWeight: "600" },
});

export default MyProfileScreen;