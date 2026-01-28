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
        petsArray.push({ id: doc.id, ...doc.data() });
      });
      setPets(petsArray);
    });

    return () => unsubscribe();
  }, []);

  // Delete Pet Function
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
              // Cloudinary එකෙන් image එක delete කරන එක අමතර වැඩක්, දැනට අපි Firestore එකෙන් අයින් කරමු.
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
      {item.petImage ? (
        <Image source={{ uri: item.petImage }} style={styles.petImage} />
      ) : (
        <View style={[styles.petImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' }]}>
          <MaterialCommunityIcons name="paw" size={50} color="#CCC" />
        </View>
      )}
      
      <View style={styles.petInfo}>
        <Text style={styles.petName} numberOfLines={1}>{item.petName}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialCommunityIcons name="pencil-outline" size={18} color="#FF8C00" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => handleDeletePet(item.id, item.petName)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Android වල Status bar එක නිසා උඩින් ඉඩ තැබීම */}
      <View style={styles.topPadding} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Pet Family</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {/* Pet List */}
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
          <TouchableOpacity 
            style={styles.addNowBtn}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.addNowText}>Add Pet Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  // Notch එක තියෙන phones වලට උඩින් ඉඩ තැබීමට
  topPadding: { 
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginTop: 10 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 15, 
    paddingBottom: 15 
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#1C1C1E" },
  listContent: { paddingHorizontal: 10, paddingBottom: 30 },
  petCard: {
    backgroundColor: "#FFF",
    width: (width / 2) - 20,
    margin: 10,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F2F2F7'
  },
  petImage: { width: "100%", height: 160 },
  petInfo: { padding: 15 },
  petName: { fontSize: 17, fontWeight: "800", color: "#1C1C1E" },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12, gap: 8 },
  actionBtn: { 
    width: 35, 
    height: 35, 
    borderRadius: 12, 
    backgroundColor: "#F8F8F8", 
    justifyContent: "center", 
    alignItems: "center"
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100 },
  emptyText: { fontSize: 18, color: "#8E8E93", marginTop: 15, fontWeight: "600" },
  addNowBtn: { marginTop: 20, backgroundColor: '#FF8C00', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  addNowText: { color: '#FFF', fontWeight: '800' }
});

export default MyProfileScreen;