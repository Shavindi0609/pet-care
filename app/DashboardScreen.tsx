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
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const heroSlides = [
    { id: '1', title: 'Create a Pet Profile', sub: 'Unlock personalized care and gain 50 loyalty points', badge: 'NEW FEATURE', color: '#1C1C1E' },
    { id: '2', title: 'Grooming Offers', sub: 'Get 20% off on your first grooming session this month!', badge: 'LIMITED OFFER', color: '#FF8C00' },
    { id: '3', title: 'Expert Consultation', sub: 'Talk to professional vets online for your pet health.', badge: 'HEALTH CARE', color: '#4B3F72' }
  ];

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
    await signOut(auth);
    dispatch(logout());
  };

  const shopCategories = [
    { name: "All", color: "#F0F7FF", icon: "apps", iconColor: "#007AFF" },
    { name: "Dog", color: "#FFF8E1", icon: "dog", iconColor: "#FF9500" },
    { name: "Cat", color: "#FFF0F5", icon: "cat", iconColor: "#FF2D55" },
    { name: "Bird", color: "#E8FBF0", icon: "bird", iconColor: "#34C759" },
    { name: "Horse", color: "#F5F3FF", icon: "horse-variant", iconColor: "#5856D6" },
  ];

  const helpfulLinks = [
    { name: "Blog", icon: "newspaper-variant-outline" },
    { name: "Refer & Earn", icon: "ticket-percent-outline" },
    { name: "App Help", icon: "handshake-outline" },
    { name: "Lost Gem", icon: "cat" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>Enjoy your day,</Text>
            <Text style={styles.userName}>{user?.email?.split("@")[0] || 'Shavindi'} ✨</Text>
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

        {/* Carousel */}
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
                  <View style={styles.newBadge}><Text style={styles.newBadgeText}>{item.badge}</Text></View>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSubText}>{item.sub}</Text>
                  <TouchableOpacity style={styles.heroBtn}>
                    <Text style={styles.heroBtnText}>Start Now</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.heroIconFloating}>
                  <MaterialCommunityIcons name="paw" size={120} color="rgba(255,255,255,0.15)" />
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
            <TouchableOpacity><Text style={styles.seeAllText}>View All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {shopCategories.map((item) => (
            <TouchableOpacity key={item.name} style={styles.catItem}>
              <View style={[styles.catIconBox, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons name={item.icon as any} size={28} color={item.iconColor} />
              </View>
              <Text style={styles.catLabelText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services */}
        <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>Pet Services</Text>
        <View style={styles.servicesGrid}>
          {[
            { n: 'Grooming', i: 'content-cut', s: 'Beauty' },
            { n: 'Boarding', i: 'home-variant', s: 'Safety' },
            { n: 'Transport', i: 'truck-delivery', s: 'Fast' },
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

        {/* My Pets - Pink Card */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
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

        {/* Helpful Links */}
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

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.askFidoBtn} activeOpacity={0.8}>
         <View style={styles.askFidoIconWrap}>
            <MaterialCommunityIcons name="dog-service" size={30} color="#FFB800" />
         </View>
         <Text style={styles.askFidoText}>Ask Luna?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greetingTitle: { fontSize: 15, color: '#8E8E93', fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: '#1C1C1E' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircleBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30', borderWidth: 1.5, borderColor: '#FFF' },
  avatarWrapper: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FF8C00', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  carouselWrapper: { marginBottom: 30 },
  heroCard: { width: width - 40, borderRadius: 30, padding: 22, height: 185, overflow: 'hidden' },
  heroTextContent: { zIndex: 2, flex: 1, justifyContent: 'center' },
  newBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  newBadgeText: { color: '#FF8C00', fontSize: 10, fontWeight: '800' },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  heroSubText: { fontSize: 13, color: '#AEAEB2', marginTop: 8, lineHeight: 18, width: '80%' },
  heroBtn: { backgroundColor: '#FF8C00', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, marginTop: 15, alignSelf: 'flex-start' },
  heroBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  heroIconFloating: { position: 'absolute', right: -15, bottom: -15 },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 20, backgroundColor: '#FF8C00' },
  inactiveDot: { width: 6, backgroundColor: '#E0E0E0' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#1C1C1E' },
  seeAllText: { color: '#FF8C00', fontWeight: '700', fontSize: 13 },
  horizontalScroll: { marginHorizontal: -20, paddingLeft: 20 },
  catItem: { alignItems: 'center', marginRight: 18 },
  catIconBox: { width: 68, height: 68, borderRadius: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10 },
  catLabelText: { fontSize: 12, fontWeight: '700', color: '#3A3A3C', marginTop: 8 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceItem: { width: '48%', backgroundColor: '#F9F9F9', padding: 16, borderRadius: 22, marginBottom: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  serviceMainText: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  serviceSubText: { fontSize: 11, color: '#8E8E93' },
  petProfileCard: { backgroundColor: '#FFE4E6', borderRadius: 24, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5, overflow: 'hidden', position: 'relative', height: 150 },
  petCardText: { flex: 1, zIndex: 2 },
  petCardTitle: { fontSize: 20, fontWeight: '800', color: '#1C1C1E', lineHeight: 26, width: '90%' },
  petCardSub: { fontSize: 15, color: '#3A3A3C', marginTop: 10, fontWeight: '500' },
  petCardAction: { width: 50, height: '100%', justifyContent: 'flex-start', alignItems: 'flex-end' },
  plusIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', zIndex: 2, marginTop: -5 },
  bgPawIcon: { position: 'absolute', right: -25, bottom: -15, opacity: 0.7, zIndex: 1, transform: [{ rotate: '10deg' }] },
  linksContainer: { marginTop: 30, backgroundColor: '#FFF9F5', borderRadius: 28, padding: 20 },
  linksTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  linksGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  linkItem: { alignItems: 'center', width: (width - 80) / 4 },
  linkCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#FFF', borderWidth: 1.2, borderColor: '#FFE0CC', justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2 },
  linkLabel: { fontSize: 11, fontWeight: '600', color: '#444', textAlign: 'center' },
  logoutBtn: { marginTop: 40, marginBottom: 20, paddingVertical: 16, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFE5E5' },
  logoutText: { color: '#FF3B30', fontWeight: '700', fontSize: 15 },
  askFidoBtn: { position: 'absolute', bottom: 30, right: 20, alignItems: 'center' },
  askFidoIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFBE6', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#FFB800', shadowOpacity: 0.2, shadowRadius: 10 },
  askFidoText: { fontSize: 12, fontWeight: '700', color: '#AEAEB2', marginTop: 5 }
});

export default DashboardScreen;