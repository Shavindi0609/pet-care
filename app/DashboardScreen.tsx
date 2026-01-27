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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => (state.auth as any)?.user);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

// Soft Peach/Cream Monochromatic Theme
  const heroSlides = [
 { 
      id: '1', 
      title: 'Create a Pet Profile', 
      sub: 'Unlock personalized care and gain 50 loyalty points', 
      badge: 'NEW FEATURE', 
      color: '#FFF3E0',      // Original Soft Peach/Cream
      textColor: '#E65100',  // Dark Orange
      btnColor: '#FF8C00'    // Original Orange
    },
    { 
    id: '2', 
    title: 'Grooming Offers', 
    sub: 'Get 20% off on your first grooming session this month!', 
    badge: 'LIMITED OFFER', 
    color: '#FFE4E6',      // Soft Rose Pink (Background)
    textColor: '#8D6E63',  // Soft Coffee Brown (Title/Sub text)
    btnColor: '#E91E63'    // මෙතනට තද Pink (Deep Rose) එකක් දැම්මා
    },
    { 
      id: '3', 
      title: 'Expert Consultation', 
      sub: 'Talk to professional vets online for your pet health.', 
      badge: 'HEALTH CARE', 
      color: '#FFE0B2',      // Deeper Peach (තුන්වැනි shade එක)
      textColor: '#BF360C',  // Deep Terracotta
      btnColor: '#E65100' 
    }
  ];

//   // Soft Rose Pink & Peach Theme
//   const heroSlides = [
//     { 
//       id: '1', 
//       title: 'Create a Pet Profile', 
//       sub: 'Unlock personalized care and gain 50 loyalty points', 
//       badge: 'NEW FEATURE', 
//       color: '#FFE4E6',      // ඔයා දුන්න Soft Rose Pink (පළමු shade එක)
//       textColor: '#8D6E63',  // Soft Coffee Brown
//       btnColor: '#FFB1B8'    // Muted Rose Button
//     },
//     { 
//       id: '2', 
//       title: 'Grooming Offers', 
//       sub: 'Get 20% off on your first grooming session this month!', 
//       badge: 'LIMITED OFFER', 
//       color: '#FFF0F0',      // ඉතාමත් ලා පැහැති Soft White-Pink
//       textColor: '#E65100',  // Warm Orange-Brown Text
//       btnColor: '#FFCCBC'    // Pastel Peach Button
//     },
//     { 
//       id: '3', 
//       title: 'Expert Consultation', 
//       sub: 'Talk to professional vets online for your pet health.', 
//       badge: 'HEALTH CARE', 
//       color: '#FFEBEE',      // Soft Misty Rose
//       textColor: '#C2185B',  // Deep Rose Text
//       btnColor: '#F48FB1'    // Pinkish Button
//     }
//   ];
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= heroSlides.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 3500); 
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const shopCategories = [
    { name: "All", emoji: "…" },
    { name: "Dog", emoji: "🐶" },
    { name: "Cat", emoji: "🐱" },
    { name: "Bird", emoji: "🐦" },
    { name: "Horse", emoji: "🐴" },
    { name: "Cow", emoji: "🐮" },
  ];

  const helpfulLinks = [
    { name: "Blog", icon: "newspaper-variant-outline" },
    { name: "Refer & Earn", icon: "ticket-percent-outline" },
    { name: "App Help", icon: "handshake-outline" },
    { name: "Lost Gem", icon: "cat" },
  ];

  // ... (imports and component logic remains exactly the same)

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent} // Spacing පාලනය කරන්නේ මෙතනින්
      >
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>Enjoy your day,</Text>
            <Text style={styles.userName}>{user?.displayName || 'Shavindi'} ✨</Text>
          </View>
          <View style={styles.headerRight}>
             <TouchableOpacity style={styles.iconCircleBtn}>
                <MaterialCommunityIcons name="magnify" size={22} color="#1A1A1A" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconCircleBtn}>
                <MaterialCommunityIcons name="bell-outline" size={22} color="#FF8C00" />
                <View style={styles.notifBadge} />
             </TouchableOpacity>
             <View style={styles.avatarWrapper}>
                <Text style={styles.avatarText}>SA</Text>
             </View>
          </View>
        </View>

        {/* Updated Carousel Section */}
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
                  <View style={[styles.newBadge, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                    <Text style={[styles.newBadgeText, { color: item.textColor }]}>{item.badge}</Text>
                  </View>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSubText}>{item.sub}</Text>
                  <TouchableOpacity style={[styles.heroBtn, { backgroundColor: item.btnColor }]}>
                    <Text style={styles.heroBtnText}>Start Now</Text>
                  </TouchableOpacity>
                </View>
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
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop For</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {shopCategories.map((item) => (
            <TouchableOpacity key={item.name} style={styles.catItem}>
              <View style={[styles.catIconBox, item.name === "All" && styles.activeCatBox]}>
                {item.name === "All" ? (
                  <Text style={styles.catAllText}>All</Text>
                ) : (
                  <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                )}
              </View>
              <Text style={styles.catLabelText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pet Services */}
        <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>Pet Services</Text>
        <View style={styles.servicesGrid}>
          {[
            { n: 'Grooming', i: 'content-cut', s: 'Beauty' },
            { n: 'Boarding', i: 'home-variant', s: 'Safety' },
            { n: 'Transportation', i: 'truck-delivery', s: 'Fast' },
            { n: 'Training', i: 'whistle-outline', s: 'Smart' }
          ].map((s) => (
            <TouchableOpacity key={s.n} style={styles.serviceItem}>
              <View style={styles.serviceIconWrap}>
                <MaterialCommunityIcons name={s.i as any} size={24} color="#FF8C00" />
              </View>
              <View>
                <Text style={styles.serviceMainText}>{s.n}</Text>
                <Text style={styles.serviceSubText}>{s.s}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Pets */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Pets")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.petProfileCard}>
          <View style={styles.petCardText}>
            <Text style={styles.petCardTitle}>Oops! Looks like no pets are added yet</Text>
            <Text style={styles.petCardSub}>Create a pet profile now</Text>
          </View>
          <View style={styles.petCardAction}>
              <MaterialCommunityIcons name="paw" size={110} color="#FF8A80" style={styles.bgPawIcon} />
              <View style={styles.plusIconCircle}>
                <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
              </View>
          </View>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <Text style={styles.linksTitle}>Other Helpful Links</Text>
          <View style={styles.linksGrid}>
            {helpfulLinks.map((link) => (
              <TouchableOpacity key={link.name} style={styles.linkItem}>
                <View style={styles.linkCircle}>
                  <MaterialCommunityIcons name={link.icon as any} size={24} color="#FF8C00" />
                </View>
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

      {/* Floating Button */}
      <TouchableOpacity style={styles.askFidoBtn} activeOpacity={0.8}>
          <View style={styles.askFidoIconWrap}>
            <MaterialCommunityIcons name="dog-service" size={30} color="#FFB800" />
          </View>
          <Text style={styles.askFidoText}>Ask Fido?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 23,      // උඩින් තියෙන Space එක
    paddingBottom: 120,  // යටින් Tab Bar එකට වැහෙන නිසා දාපු වැඩිපුර Space එක
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25,
    marginTop: 10 // Status Bar එකට යටින් ඉඩ තැබීමට
  },
  // ... (rest of your original styles remain unchanged)
  greetingTitle: { fontSize: 15, color: '#8E8E93', fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: '#1C1C1E' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircleBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30', borderWidth: 1.5, borderColor: '#FFF' },
  avatarWrapper: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#8E8E93', fontWeight: 'bold' },
  carouselWrapper: { marginBottom: 30 },
  heroCard: { width: width - 40, borderRadius: 35, padding: 25, height: 195, overflow: 'hidden' },
  heroTextContent: { zIndex: 2, flex: 1, justifyContent: 'center' },
  newBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 12 },
  newBadgeText: { fontSize: 10, fontWeight: '800' },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#1C1C1E', lineHeight: 28 },
  heroSubText: { fontSize: 14, color: '#444', marginTop: 8, lineHeight: 20, width: '75%', fontWeight: '500' },
  heroBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, marginTop: 18, alignSelf: 'flex-start' },
  heroBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  heroIconFloating: { position: 'absolute', right: -25, bottom: -25 },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 22, backgroundColor: '#FF8C00' },
  inactiveDot: { width: 6, backgroundColor: '#E0E0E0' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#1C1C1E' },
  seeAllText: { color: '#8E8E93', fontWeight: '700', fontSize: 13 },
  horizontalScroll: { marginHorizontal: -20, paddingLeft: 20, marginBottom: 5 },
  catItem: { alignItems: 'center', marginRight: 22 },
  catIconBox: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, borderWidth: 1, borderColor: '#F2F2F7' },
  activeCatBox: { backgroundColor: '#E3F2FD', borderColor: '#E3F2FD' },
  catAllText: { fontSize: 16, fontWeight: '600', color: '#8E8E93' },
  catLabelText: { fontSize: 14, fontWeight: '600', color: '#3A3A3C', marginTop: 10 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceItem: { width: '48%', backgroundColor: '#F9F9F9', padding: 16, borderRadius: 22, marginBottom: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  serviceMainText: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  serviceSubText: { fontSize: 11, color: '#8E8E93' },
  petProfileCard: { backgroundColor: '#FFE4E6', borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5, overflow: 'hidden', height: 150 },
  petCardText: { flex: 1, zIndex: 2 },
  petCardTitle: { fontSize: 20, fontWeight: '800', color: '#1C1C1E', lineHeight: 26, width: '90%' },
  petCardSub: { fontSize: 15, color: '#3A3A3C', marginTop: 10, fontWeight: '500' },
  petCardAction: { width: 50, justifyContent: 'flex-start', alignItems: 'flex-end' },
  plusIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center' },
  bgPawIcon: { position: 'absolute', right: -25, bottom: -15, opacity: 0.7, transform: [{ rotate: '10deg' }] },
  linksContainer: { marginTop: 30, backgroundColor: '#F8F8F8', borderRadius: 28, padding: 20 },
  linksTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  linksGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  linkItem: { alignItems: 'center', width: (width - 80) / 4 },
  linkCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#FFF', borderWidth: 1.2, borderColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2 },
  linkLabel: { fontSize: 11, fontWeight: '600', color: '#444', textAlign: 'center' },
  logoutBtn: { marginTop: 40, marginBottom: 20, paddingVertical: 16, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFE5E5' },
  logoutText: { color: '#FF3B30', fontWeight: '700', fontSize: 15 },
  askFidoBtn: { position: 'absolute', bottom: 117, right: 20, alignItems: 'center' }, // Tab Bar එකට උඩින් ඉන්න bottom වැඩි කළා
  askFidoIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFBE6', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  askFidoText: { fontSize: 12, fontWeight: '700', color: '#AEAEB2', marginTop: 5 }
});

export default DashboardScreen;