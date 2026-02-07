import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddPetModal from '../component/AddPet'; 
// Firebase imports (ඔයාගේ path එක නිවැරදි දැයි බලන්න)
import { db, storage, auth } from "../config/firebase"; 
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => (state.auth as any)?.user);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [petName, setPetName] = useState("");
  // Pets state එක component එක ඇතුළට ගත්තා
  const [pets, setPets] = useState<any[]>([]); 
  
  const flatListRef = useRef<FlatList>(null);

  // const heroSlides = [
  //   { id: "1", title: "Create a Pet Profile", sub: "Unlock personalized care and gain 50 loyalty points", badge: "NEW FEATURE", color: "#FFF3E0", textColor: "#E65100", btnColor: "#FF8C00" },
  //   { id: "2", title: "Grooming Offers", sub: "Get 20% off on your first grooming session this month!", badge: "LIMITED OFFER", color: "#FFE4E6", textColor: "#8D6E63", btnColor: "#E91E63" },
  //   { id: "3", title: "Expert Consultation", sub: "Talk to professional vets online for your pet health.", badge: "HEALTH CARE", color: "#FFE0B2", textColor: "#BF360C", btnColor: "#E65100" },
  // ];

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= heroSlides.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeIndex]);

  useEffect(() => {
  if (!auth.currentUser) return;

  // ලොග් වී සිටින පරිශීලකයාට අදාළ pets ලා පමණක් ලබා ගැනීම
  const q = query(
    collection(db, "pets"),
    where("userId", "==", auth.currentUser.uid)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const petsArray: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      petsArray.push({
        id: doc.id,
        name: data.petName,
        image: data.petImage,
      });
    });
    setPets(petsArray); // මෙතැනදී ස්වයංක්‍රීයව UI එක update වේ
  }, (error) => {
    console.error("Fetch Error: ", error);
  });

  return () => unsubscribe(); // Cleanup function
}, [auth.currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const heroSlides = [
  { 
    id: "1", 
    title: "Create a Pet Profile", 
    sub: "Unlock personalized care and gain 50 loyalty points", 
    badge: "NEW FEATURE", 
    color: "#FFF3E0", 
    textColor: "#E65100", 
    btnColor: "#FF8C00",
    image: "https://static.vecteezy.com/system/resources/thumbnails/041/713/275/small/ai-generated-happy-australian-shepherd-dog-lying-down-with-tongue-out-on-transparent-background-stock-png.png" // උදාහරණයක් ලෙස
  },
  { 
    id: "2", 
    title: "Grooming Offers", 
    sub: "Get 20% off on your first grooming session!", 
    badge: "LIMITED OFFER", 
    color: "#FFE4E6", 
    textColor: "#8D6E63", 
    btnColor: "#E91E63",
    image: "https://static.vecteezy.com/system/resources/thumbnails/059/044/454/small/two-cats-sitting-next-to-each-other-on-a-black-background-free-png.png" 
  },
  { 
    id: "3", 
    title: "Expert Consultation", 
    sub: "Talk to professional vets online for your pet health.", 
    badge: "HEALTH CARE", 
    color: "#FFE0B2", 
    textColor: "#BF360C", 
    btnColor: "#E65100",
    image: "https://static.vecteezy.com/system/resources/thumbnails/059/153/370/small/striped-tabby-kitten-hugging-a-smiling-puppy-with-its-paws-on-an-isolated-solid-color-background-transparent-background-png.png"
  },
  // ... අනිත් ඒවාටත් දාන්න
];
  const shopCategories = [
    { name: "All", emoji: "🐾" }, { name: "Dog", emoji: "🐶" }, { name: "Cat", emoji: "🐱" },
    { name: "Bird", emoji: "🐦" }, { name: "Horse", emoji: "🐴" }, { name: "Cow", emoji: "🐮" },
  ];

const handleAddNewPet = async (petData: any) => {
  if (!auth.currentUser) {
    Alert.alert("Error", "Please login first!");
    return;
  }

  // දත්ත වෙන් කර ගැනීම (Destructuring)
  const { name, type, breed, age, gender, image } = petData;

  try {
    let finalImageUrl = null;

    if (image) {
      // Cloudinary Upload Logic
      const data = new FormData();
      data.append('file', {
        uri: image,
        type: 'image/jpeg',
        name: 'pet_image.jpg',
      } as any);
      
      data.append('upload_preset', 'pet_care_upload'); 
      data.append('cloud_name', 'dm4qd5n2c');

      const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dm4qd5n2c/image/upload', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await uploadResponse.json();
      if (result.secure_url) {
        finalImageUrl = result.secure_url;
      }
    }

    // Firestore එකේ අලුත් fields (breed, age, gender) සමඟ save කිරීම
    await addDoc(collection(db, "pets"), {
      userId: auth.currentUser.uid,
      petName: name,
      petType: type,
      breed: breed,
      age: age,
      gender: gender,
      petImage: finalImageUrl, 
      createdAt: serverTimestamp(),
    });

    Alert.alert("Success", `${name}'s profile created! 🐾✨`);
    setIsModalVisible(false);
  } catch (error: any) {
    console.error("Upload/Save Error: ", error);
    Alert.alert("Error", "Something went wrong while saving.");
  }
};
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>Enjoy your day,</Text>
            <Text style={styles.userName}>{user?.displayName || "Shavindi"} ✨</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircleBtn}><MaterialCommunityIcons name="magnify" size={22} color="#1A1A1A" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconCircleBtn}>
              <MaterialCommunityIcons name="bell-outline" size={22} color="#FF8C00" />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <View style={styles.avatarWrapper}><Text style={styles.avatarText}>SA</Text></View>
          </View>
        </View>

        {/* Carousel Section */}
        <View style={styles.carouselWrapper}>
          <FlatList
            ref={flatListRef}
            data={heroSlides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
              setActiveIndex(index);
            }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity style={[styles.heroCard, { backgroundColor: item.color }]} activeOpacity={0.9}>
              <View style={styles.heroTextContent}>
                <View style={[styles.newBadge, { backgroundColor: "rgba(0,0,0,0.05)" }]}>
                  <Text style={[styles.newBadgeText, { color: item.textColor }]}>{item.badge}</Text>
                </View>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <Text style={styles.heroSubText}>{item.sub}</Text>
                <TouchableOpacity style={[styles.heroBtn, { backgroundColor: item.btnColor }]}>
                  <Text style={styles.heroBtnText}>Start Now</Text>
                </TouchableOpacity>
              </View>

                {/* මෙතනට Image එක එකතු කරන්න */}
            <Image 
              source={{ uri: item.image }} 
              style={styles.heroImage} 
              resizeMode="contain" 
            />
               <View style={styles.heroIconFloating}>
                <MaterialCommunityIcons name="paw" size={140} color="rgba(0,0,0,0.04)" />
              </View>
            </TouchableOpacity>
            )}
          />
          <View style={styles.dotContainer}>
            {heroSlides.map((_, i) => (
              <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
            ))}
          </View>
        </View>

        {/* Shop Section */}
        <Text style={styles.sectionTitle}>Shop For</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {shopCategories.map((item) => (
            <TouchableOpacity key={item.name} style={styles.catItem} onPress={() => navigation.navigate("Shop", { category: item.name })}>
              <View style={[styles.catIconBox, item.name === "All" && styles.activeCatBox]}><Text style={styles.emojiText}>{item.emoji}</Text></View>
              <Text style={styles.catLabelText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pet Services */}
        <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>Pet Services</Text>
        <View style={styles.servicesGrid}>
          {[
            { n: "Grooming", i: "content-cut", s: "Beauty" },
            { n: "Boarding", i: "home-variant", s: "Safety" },
            { n: "Transportation", i: "truck-delivery", s: "Fast" },
            { n: "Training", i: "whistle-outline", s: "Smart" },
          ].map((s) => (
            <TouchableOpacity key={s.n} style={styles.serviceItem}>
              <View style={styles.serviceIconWrap}><MaterialCommunityIcons name={s.i as any} size={24} color="#FF8C00" /></View>
              <View>
                <Text style={styles.serviceMainText}>{s.n}</Text>
                <Text style={styles.serviceSubText}>{s.s}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Pets Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Pets")}><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
        </View>

        {/* My Pets Dynamic Section */}
        {pets.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {pets.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.petProfileCard, { backgroundColor: '#E3F2FD', marginRight: 15, width: width * 0.7 }]}>
                <View style={styles.petCardText}>
                  <Text style={styles.petCardTitle}>{item.name}</Text>
                  <Text style={styles.petCardSub}>Healthy & Happy ✨</Text>
                </View>
                <View style={styles.petCardAction}>
                   {item.image ? (
                     <Image source={{ uri: item.image }} style={styles.petImageCircle} />
                   ) : (
                     <MaterialCommunityIcons name="dog" size={60} color="#FF8C00" />
                   )}
                </View>
              </TouchableOpacity>
            ))}
            {/* එකෙක් හිටියත් තව කෙනෙක්ව add කරන්න පුළුවන් plus card එක */}
            <TouchableOpacity 
                style={[styles.petProfileCard, { width: 100, backgroundColor: '#F2F2F7', justifyContent: 'center' }]} 
                onPress={() => setIsModalVisible(true)}
            >
                <MaterialCommunityIcons name="plus" size={40} color="#8E8E93" style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <TouchableOpacity style={styles.petProfileCard} onPress={() => setIsModalVisible(true)} activeOpacity={0.8}>
            <View style={styles.petCardText}>
              <Text style={styles.petCardTitle}>Oops! Looks like no pets are added yet</Text>
              <Text style={styles.petCardSub}>Create a pet profile now</Text>
            </View>
            <View style={styles.petCardAction}>
                <MaterialCommunityIcons name="paw" size={120} color="#FF8A80" style={styles.bgPawIcon} />
                <View style={styles.plusIconCircle}><MaterialCommunityIcons name="plus" size={20} color="#FFF" /></View>
            </View>
          </TouchableOpacity>
        )}

        {/* Other Sections */}
        <View style={styles.linksContainer}>
          <Text style={styles.linksTitle}>Other Helpful Links</Text>
          <View style={styles.linksGrid}>
            {[
              { name: "Blog", icon: "newspaper-variant-outline" },
              { name: "Refer & Earn", icon: "ticket-percent-outline" },
              { name: "App Help", icon: "handshake-outline" },
              { name: "Lost Gem", icon: "cat" },
            ].map((link) => (
              <TouchableOpacity key={link.name} style={styles.linkItem}>
                <View style={styles.linkCircle}><MaterialCommunityIcons name={link.icon as any} size={24} color="#FF8C00" /></View>
                <Text style={styles.linkLabel}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="power" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign out from your account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* අලුත් AddPetModal එක මෙතන තියෙන්නේ */}
      <AddPetModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onAddPet={handleAddNewPet} 
      />

      {/* Floating Button */}
    <TouchableOpacity 
      style={styles.askFidoBtn} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate("AskFido")} // Navigation එක මෙතනට එකතු කරන්න
    >
      <View style={styles.askFidoIconWrap}>
        <MaterialCommunityIcons name="dog-service" size={30} color="#FFB800" />
      </View>
      <Text style={styles.askFidoText}>Ask Fido?</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 23, paddingBottom: 120 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25, marginTop: 10 },
  greetingTitle: { fontSize: 15, color: "#8E8E93", fontWeight: "500" },
  userName: { fontSize: 24, fontWeight: "800", color: "#1C1C1E" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircleBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#F8F8F8", justifyContent: "center", alignItems: "center" },
  notifBadge: { position: "absolute", top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF3B30", borderWidth: 1.5, borderColor: "#FFF" },
  avatarWrapper: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#F2F2F7", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#8E8E93", fontWeight: "bold" },
  carouselWrapper: { marginBottom: 30 },
  heroCard: { width: width - 40, borderRadius: 35, padding: 25, height: 195, overflow: "hidden" },
  // heroTextContent: { zIndex: 2, flex: 1, justifyContent: "center" },
  newBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, alignSelf: "flex-start", marginBottom: 12 },
  newBadgeText: { fontSize: 10, fontWeight: "800" },
  heroTitle: { fontSize: 24, fontWeight: "900", color: "#1C1C1E" },
  heroSubText: { fontSize: 14, color: "#444", marginTop: 8, width: "65%", fontWeight: "500" },
  heroBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, marginTop: 18, alignSelf: "flex-start" },
  heroBtnText: { color: "#FFF", fontWeight: "800" },
  heroIconFloating: { position: "absolute", right: -25, bottom: -25 },
  dotContainer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 22, backgroundColor: "#FF8C00" },
  inactiveDot: { width: 6, backgroundColor: "#E0E0E0" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15, marginTop: 20 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#1C1C1E" },
  seeAllText: { color: "#8E8E93", fontWeight: "700", fontSize: 13 },
  horizontalScroll: { marginHorizontal: -20, paddingLeft: 20 },
  catItem: { alignItems: "center", marginRight: 22 },
  catIconBox: { width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF", elevation: 3, borderWidth: 1, borderColor: "#F2F2F7" },
  activeCatBox: { backgroundColor: "#E3F2FD" },
  catLabelText: { fontSize: 14, fontWeight: "600", color: "#3A3A3C", marginTop: 10 },
  emojiText: { fontSize: 30 },
  servicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  serviceItem: { width: "48%", backgroundColor: "#F9F9F9", padding: 16, borderRadius: 22, marginBottom: 15, flexDirection: "row", alignItems: "center", gap: 12 },
  serviceIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" },
  serviceMainText: { fontSize: 14, fontWeight: "700" },
  serviceSubText: { fontSize: 11, color: "#8E8E93" },
  
  petProfileCard: { backgroundColor: '#FFE4E6', borderRadius: 28, padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', height: 160, elevation: 2 },
  petCardText: { flex: 1.2, zIndex: 2 },
  petCardTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1E', lineHeight: 24 },
  petCardSub: { fontSize: 14, color: '#3A3A3C', marginTop: 8, fontWeight: '600' },
  petCardAction: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
  petImageCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#FFF' },
  plusIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0, zIndex: 4, borderWidth: 2, borderColor: '#FFE4E6' },
  bgPawIcon: { position: 'absolute', right: -20, bottom: -20, opacity: 0.4, transform: [{ rotate: '15deg' }] },

  linksContainer: { marginTop: 30, backgroundColor: "#F8F8F8", borderRadius: 28, padding: 20 },
  linksTitle: { fontSize: 17, fontWeight: "800", color: "#1A1A1A", marginBottom: 20 },
  linksGrid: { flexDirection: "row", justifyContent: "space-between" },
  linkItem: { alignItems: "center", width: (width - 80) / 4 },
  linkCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginBottom: 8, elevation: 2 },
  linkLabel: { fontSize: 11, fontWeight: "600", color: "#444", textAlign: "center" },
  logoutBtn: { marginTop: 40, paddingVertical: 16, borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, backgroundColor: "#FFF5F5" },
  logoutText: { color: "#FF3B30", fontWeight: "700" },
  askFidoBtn: { position: "absolute", bottom: 117, right: 20, alignItems: "center" },
  askFidoIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FFFBE6", justifyContent: "center", alignItems: "center", elevation: 5 },
  askFidoText: { fontSize: 12, fontWeight: "700", color: "#AEAEB2", marginTop: 5 },
//   heroImage: {
//   position: "absolute",
//   right: -30,
//   bottom: 0,
//   width: 180,
//   height: 180,
//   zIndex: 1, // Text එකට යටින් තියෙන්න ඕනේ නම් 1 දාන්න
// },
heroImage: {
  position: "absolute",
  right: -20,     // Card එකේ අයිනටම ගන්න (අගය අඩු කරන තරමට දකුණට යනවා)
  bottom: -5,    // Card එකේ පල්ලෙහාටම ගන්න
  width: 180,     // 180 තිබ්බ එක 220 හෝ 250 දක්වා වැඩි කරන්න
  height: 180,    // width එකට සමානව තියන්න
  zIndex: 1,
},
heroTextContent: {
  zIndex: 2, // Text එක Image එකට උඩින් පේන්න
  flex: 1,
  justifyContent: "center",
},
});

export default DashboardScreen;