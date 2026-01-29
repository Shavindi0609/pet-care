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
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../redux/authSlice";
import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EditPetModal from "../component/EditPetModel";

const { width } = Dimensions.get("window");

const MyProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [pets, setPets] = useState<any[]>([]);
  const user = useSelector((state: RootState) => (state.auth as any)?.user);
  const currentUserName = user?.displayName || auth.currentUser?.displayName || "User";
  const currentUserEmail = user?.email || auth.currentUser?.email || "No Email";

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);

  const handleEditPress = (pet: any) => {
    setSelectedPet(pet);
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "pets"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsArray: any[] = [];
      querySnapshot.forEach((doc) => {
        petsArray.push({ id: doc.id, ...doc.data() });
      });
      setPets(petsArray);
    }, (error) => console.error("Firestore Error: ", error));
    return () => unsubscribe();
  }, []);

  const handleUpdatePet = async (updatedData: any) => {
    if (!selectedPet?.id) return;
    try {
      const petRef = doc(db, "pets", selectedPet.id);
      await updateDoc(petRef, {
        petName: updatedData.name,
        petType: updatedData.type,
        breed: updatedData.breed,
        age: updatedData.age,
        gender: updatedData.gender,
      });
      Alert.alert("Success", "Pet profile updated! 🐾");
      setIsEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Could not update pet details.");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            dispatch(logout());
            navigation.replace("Login");
          } catch (error) {
            Alert.alert("Error", "Logout failed.");
          }
        },
      },
    ]);
  };

  const handleDeletePet = (id: string, name: string) => {
    Alert.alert("Remove Pet", `Are you sure you want to remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "pets", id));
          } catch (error) {
            Alert.alert("Error", "Could not delete pet.");
          }
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View>
      {/* එකම එක Top Header එකක් පමණයි - Back සහ Logout මෙහි ඇත */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#1C1C1E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.userSection}>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarLetter}>{currentUserName.charAt(0).toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate("ProfileEdit")}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
        <Text style={styles.userNameText}>{currentUserName}</Text>
        <Text style={styles.userEmailText}>{currentUserEmail}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pets.length}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statNumber}>50</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Pet Family</Text>
          <Text style={styles.petCountBadge}>{pets.length} Registered</Text>
        </View>
      </View>
    </View>
  );

 const renderPetItem = ({ item }: { item: any }) => (
  <TouchableOpacity 
    activeOpacity={0.9}
    style={styles.petCard}
    // මෙතනින් තමයි අදාළ pet ගේ නම සහ ID එක අලුත් screen එකට යවන්නේ
    onPress={() => navigation.navigate("PetMedicalRecords", { 
      petId: item.id, 
      petName: item.petName || item.name 
    })}
  >
    <View style={styles.imageContainer}>
      {item.petImage ? (
        <Image source={{ uri: item.petImage }} style={styles.petImage} />
      ) : (
        <View style={styles.placeholderImg}>
          <MaterialCommunityIcons name="paw" size={40} color="#DDD" />
        </View>
      )}
      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>{item.petType?.split(" ")[0] || "🐾"}</Text>
      </View>
    </View>

    <View style={styles.petDetails}>
      <View style={styles.nameRow}>
        <Text style={styles.petName} numberOfLines={1}>{item.petName || item.name}</Text>
        <MaterialCommunityIcons
          name={item.gender === "Male" ? "gender-male" : "gender-female"}
          size={16}
          color={item.gender === "Male" ? "#2196F3" : "#F06292"}
        />
      </View>
      
      <Text style={styles.breedText} numberOfLines={1}>{item.breed || "Pure Breed"}</Text>
      
      <View style={styles.ageTag}>
        <Text style={styles.ageText}>{item.age || "0"} Years Old</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.editBtn} 
          onPress={(e) => {
            e.stopPropagation(); // Card එක click වීම වැළැක්වීමට
            handleEditPress(item);
          }}
        >
          <MaterialCommunityIcons name="pencil" size={16} color="#FF8C00" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={(e) => {
            e.stopPropagation(); // Card එක click වීම වැළැක්වීමට
            handleDeletePet(item.id, item.petName || item.name);
          }}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderPetItem}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="paw-off" size={60} color="#E0E0E0" />
            <Text style={styles.emptyText}>Your pet family is empty!</Text>
          </View>
        }
      />
      <EditPetModal 
        isVisible={isEditModalVisible} 
        onClose={() => setIsEditModalVisible(false)} 
        onUpdate={handleUpdatePet} 
        petData={selectedPet} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 33 : 10,
    paddingBottom: 10,
  },
  headerIconBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: "#F2F2F7", justifyContent: "center", alignItems: "center",
  },
  userSection: { alignItems: "center", paddingHorizontal: 20 },
  profileAvatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#FF8C00",
    justifyContent: "center", alignItems: "center", elevation: 4,
  },
  avatarLetter: { fontSize: 40, color: "#FFF", fontWeight: "900" },
  editProfileBtn: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: "#E5E5EA" },
  editProfileText: { fontSize: 13, color: "#8E8E93", fontWeight: "600" },
  userNameText: { fontSize: 24, fontWeight: "800", color: "#1C1C1E", marginTop: 10 },
  userEmailText: { fontSize: 14, color: "#8E8E93", marginTop: 2 },
  statsRow: { flexDirection: "row", marginTop: 20, backgroundColor: "#F8F8F8", borderRadius: 20, paddingVertical: 15, width: "100%" },
  statItem: { alignItems: "center", flex: 1 },
  statBorder: { borderLeftWidth: 1, borderLeftColor: "#E5E5EA" },
  statNumber: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 12, color: "#8E8E93" },
  divider: { width: "100%", height: 1, backgroundColor: "#F2F2F7", marginVertical: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  petCountBadge: { fontSize: 12, color: "#FF8C00", backgroundColor: "#FFF5E6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  listContent: { paddingHorizontal: 10, paddingBottom: 30 }, // වැඩිපුර padding එකක් දුන්නා scroll කිරීමට
  petCard: {
    backgroundColor: "#FFF",
    width: width / 2 - 20,
    margin: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F2F2F7",
    overflow: "hidden",
    elevation: 2,
  },
  imageContainer: { width: "100%", height: 110 },
  petImage: { width: "100%", height: "100%" },
  placeholderImg: { width: "100%", height: "100%", backgroundColor: "#F2F2F7", justifyContent: "center", alignItems: "center" },
  typeBadge: { position: "absolute", top: 8, right: 8, backgroundColor: "white", borderRadius: 8, padding: 4 },
  typeBadgeText: { fontSize: 12 },
  petDetails: { padding: 12 },
  nameRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  petName: { fontSize: 15, fontWeight: "700", color: "#1C1C1E", flex: 1 },
  breedText: { fontSize: 11, color: "#8E8E93", marginVertical: 3 },
  ageTag: { backgroundColor: "#F2F2F7", alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 10 },
  ageText: { fontSize: 10, fontWeight: "600" },
  cardActions: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  editBtn: { flex: 1, height: 35, borderRadius: 8, backgroundColor: "#FFF9F0", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#FFE0B2" },
  deleteBtn: { flex: 1, height: 35, borderRadius: 8, backgroundColor: "#FFF5F5", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#FFCDD2" },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#AEAEB2", marginTop: 10 },
});

export default MyProfileScreen;