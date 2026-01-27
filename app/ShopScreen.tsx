import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ShopScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { name: "All", emoji: "🐾" },
    { name: "Dog", emoji: "🐶" },
    { name: "Cat", emoji: "🐱" },
    { name: "Bird", emoji: "🐦" },
    { name: "Horse", emoji: "🐴" },
  ];

  const products = [
    {
      id: "1",
      name: "Reflex Plus Adult Dog Food Lamb & Rice",
      price: "QAR 147.00",
      color: "#FFE4E6", // Soft Pink
      brand: "Reflex Plus",
      image: "https://images.pexels.com/photos/18684805/pexels-photo-18684805.jpeg", // උදාහරණ URL එකක්
    },
    {
      id: "2",
      name: "Mito Cat Food with Chicken 15kg",
      price: "QAR 140.00",
      color: "#FFF9C4", // Soft Yellow
      brand: "Mito",
      image: "https://paws.com.qa/wp-content/uploads/2021/03/Royal-Canin-Medium-Adult.png", // උදාහරණ URL එකක්
    },
    {
      id: "3",
      name: "Royal Canin Medium Adult Dog Food",
      price: "QAR 160.00",
      color: "#FFE4E6",
      brand: "Royal Canin",
      image: "https://paws.com.qa/wp-content/uploads/2021/03/Royal-Canin-Medium-Adult.png", // උදාහරණ URL එකක්
    },
    {
      id: "4",
      name: "Reflex Plus Kitten Food Chicken",
      price: "QAR 104.00",
      color: "#FFF9C4",
      brand: "Reflex Plus",
      image: "https://paws.com.qa/wp-content/uploads/2021/03/Royal-Canin-Medium-Adult.png", // උදාහරණ URL එකක්
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* --- Custom Header --- */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.wishlistBtn}>
            <Text style={styles.wishlistText}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn}>
            <MaterialCommunityIcons name="cart-outline" size={24} color="#FFB800" />
            <View style={styles.cartBadge} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- Search Bar --- */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={22} color="#8E8E93" style={{marginLeft: 15}} />
            <TextInput 
              placeholder="Search food, toys, etc..." 
              style={styles.input}
              placeholderTextColor="#8E8E93"
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <MaterialCommunityIcons name="tune-variant" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --- Tab Section (Feed / You) --- */}
        <View style={styles.tabWrapper}>
          <View style={styles.activeTabItem}>
            <Text style={styles.activeTabText}>Feed</Text>
            <View style={styles.dotIndicator} />
          </View>
          <TouchableOpacity>
            <Text style={styles.inactiveTabText}>You</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.brandsOutlineBtn}>
            <Text style={styles.brandsBtnText}>Brands</Text>
          </TouchableOpacity>
        </View>

        {/* --- Category Horizontal Scroll --- */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.catScroll}
          contentContainerStyle={{ paddingRight: 40 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.name} 
              style={styles.catItem}
              onPress={() => setActiveCategory(cat.name)}
            >
              <View style={[
                styles.catCircle, 
                activeCategory === cat.name && styles.activeCatCircle
              ]}>
                <Text style={styles.emojiStyle}>{cat.emoji}</Text>
              </View>
              <Text style={[
                styles.catLabel, 
                activeCategory === cat.name && styles.activeCatLabel
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* --- Products Grid --- */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridTitle}>Pet Food</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

       <View style={styles.productGrid}>
        {products.map((product) => (
            <TouchableOpacity key={product.id} style={[styles.productCard, { backgroundColor: product.color }]}>
            <View style={styles.imagePlaceholder}>
                {/* Screenshot එකේ විදිහටම image එක පෙන්වීම */}
                <Image 
                source={{ uri: product.image }} 
                style={styles.productImg} 
                resizeMode="contain" 
                />
            </View>
            
            <View style={styles.productDetails}>
                <Text style={styles.brandName}>{product.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.priceRow}>
                <Text style={styles.priceText}>{product.price}</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <MaterialCommunityIcons name="plus" size={18} color="#FFF" />
                </TouchableOpacity>
                </View>
            </View>
            </TouchableOpacity>
        ))}
</View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 100 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 70,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFF9C4",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1C1C1E" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  wishlistBtn: {
    borderWidth: 1.5,
    borderColor: "#FFB800",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
  },
  wishlistText: { color: "#FFB800", fontSize: 13, fontWeight: "700" },
  cartBtn: { width: 45, height: 45, justifyContent: "center", alignItems: "center" },
  cartBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30'
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 15,
    height: 55,
  },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: "#1C1C1E" },
  filterBtn: {
    width: 55,
    height: 55,
    backgroundColor: "#FFB800",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 25,
    gap: 25,
  },
  activeTabItem: { alignItems: "center" },
  activeTabText: { fontSize: 22, fontWeight: "900", color: "#FFB800" },
  dotIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFB800", marginTop: 4 },
  inactiveTabText: { fontSize: 22, fontWeight: "700", color: "#D1D1D6" },
  brandsOutlineBtn: {
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: "#C7C7CC",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  brandsBtnText: { color: "#8E8E93", fontWeight: "600", fontSize: 13 },
  catScroll: { marginTop: 20, paddingLeft: 20 },
  catItem: { alignItems: "center", marginRight: 25 },
  catCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  activeCatCircle: { borderColor: "#FFB800", backgroundColor: "#FFF", elevation: 3 },
  emojiStyle: { fontSize: 32 },
  catLabel: { marginTop: 8, fontSize: 14, fontWeight: "600", color: "#8E8E93" },
  activeCatLabel: { color: "#FFB800", fontWeight: "800" },
  gridHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  gridTitle: { fontSize: 18, fontWeight: "800", color: "#1C1C1E" },
  seeAllText: { color: "#FFB800", fontWeight: "700" },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 50) / 2,
    borderRadius: 25,
    marginBottom: 20,
    padding: 10,
  },
  // මෙතන එකම නම තිබුණු එක අයින් කරලා අලුත් දේවල් ටික මෙතනට දැම්මා
  imagePlaceholder: {
    height: 140, 
    backgroundColor: "#FFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden', 
  },
  productDetails: { padding: 8 },
  brandName: { fontSize: 11, fontWeight: "600", color: "#8E8E93", marginBottom: 2 },
  productName: { fontSize: 13, fontWeight: "700", color: "#1C1C1E", height: 36 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  priceText: { fontSize: 15, fontWeight: "900", color: "#1C1C1E" },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: {
    width: "90%",
    height: "90%",
  },
});

export default ShopScreen;