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
const MAIN_ORANGE = "#FF8C00"; // ඔයාගේ ප්‍රධාන වර්ණය

const ShopScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState("All");

  // --- Explore Popular Categories ---
  const exploreCategories = [
    { id: "e1", name: "Dog Food", icon: "dog" },
    { id: "e2", name: "Dog Flea & Tick", icon: "shield-bug-outline" },
    { id: "e3", name: "Dog Treats", icon: "bone" },
    { id: "e4", name: "Cat Food", icon: "food-apple-outline" },
    { id: "e5", name: "Cat Litter", icon: "cat" },
    { id: "e6", name: "Deals", icon: "tag-outline" },
  ];

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
      name: "Royal Canin Breed Health Nutrition Yorkshire Terrier Adult 8+ Dry Dog Food, 2.5-lb bag",
      price: "$ 17.54",
      color: "#FFE4E6",
      brand: "Royal Canin",
      image: "https://image.chewy.com/catalog/general/images/moe/067e301a-2974-7439-8000-58bf50515057._AC_SL1200_QL100_V1_.jpg",
    },
    {
      id: "2",
      name: "Nutrish Whole Health Blend Real Beef, Pea, & Brown Rice Recipe Dry Dog Food, 40-lb bag",
      price: "$ 27.22",
      color: "#FFF9C4",
      brand: "Nutrish",
      image: "https://image.chewy.com/catalog/general/images/nutrish-real-beef-pea-brown-rice-recipe-dry-dog-food-40lb-bag/img-297282._AC_SL1200_QL100_V1_.jpg",
    },
    {
      id: "3",
      name: "Meow Mix Original Choice Dry Cat Food, 22-lb bag",
      price: "$ 16.24",
      color: "#FFF9C4",
      brand: "Meow Mix",
      image: "https://image.chewy.com/catalog/general/images/moe/06943e93-5ccd-72aa-8000-0df12ee55eef._AC_SL1200_QL100_V1_.jpg",
    },
    {
      id: "4",
      name: "Wellness Complete Health Grain-Free Turkey Pate Variety Pack Wet Cat Food, 3-oz can, case of 4",
      price: "$ 7.54",
      color: "#FFE4E6",
      brand: "Wellness",
      image: "https://image.chewy.com/catalog/general/images/moe/069499dd-b941-7da3-8000-613a27a7b05f._AC_SL1200_QL100_V1_.jpg",
    },
  ];

  const accessories = [
    {
      id: "a1",
      name: "Tidy Cats Glade Clear Springs Scented Clumping Cat Litter, 35-lb pail",
      price: "$ 12.33",
      color: "#FFCFD2",
      brand: "Tidy Cats",
      image: "https://image.chewy.com/catalog/general/images/moe/067acbe9-6c6d-7894-8000-95a4e508fb82._AC_SL1200_QL100_V1_.jpg", 
    },
    {
      id: "a2",
      name: "Frisco Valentine's Heart Printed Dog Collar, XX-Large/XXX-Large",
      price: "QAR 58.00",
      color: "#CFD8FF",
      brand: "Frisco",
      image: "https://image.chewy.com/catalog/general/images/frisco-valentine-heart-printed-dog-collar-xx-largexxx-large/img-587213._AC_SL1200_QL100_V1_.jpg",
    },
    {
      id: "a3",
      name: "Frisco Trash Can & Raccoons Hide & Seek Puzzle Plush Squeaky Dog Toy",
      price: "$ 14.99",
      color: "#CFD8FF",
      brand: "Frisco",
      image: "https://image.chewy.com/catalog/general/images/frisco-trash-can-raccoons-hide-seek-puzzle-plush-squeaky-dog-toy-smallmedium/img-589340._AC_SL1200_QL100_V1_.jpg",
    },
    {
      id: "a4",
      name: "Kitty City Cat Ear Elevated Cat Bowls, Pink & Teal Blue, 2 count",
      price: "$ 9.99",
      color: "#FFCFD2",
      brand: "Kitty City",
      image: "https://image.chewy.com/catalog/general/images/moe/067acbd0-4cb8-78ab-8000-a886c1970646._AC_SL1200_QL100_V1_.jpg",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* --- Custom Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.wishlistBtn}>
            <Text style={styles.wishlistText}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn}>
            <MaterialCommunityIcons name="cart-outline" size={24} color={MAIN_ORANGE} />
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

        {/* --- 1. Explore Popular Categories --- */}
        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>Explore popular categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exploreScroll}>
            {exploreCategories.map((item) => (
              <TouchableOpacity key={item.id} style={styles.exploreItem}>
                <View style={styles.exploreCircle}>
                  <MaterialCommunityIcons name={item.icon as any} size={28} color={MAIN_ORANGE} />
                </View>
                <Text style={styles.exploreLabel}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- 2. Shopping For Section --- */}
        <View style={styles.tabWrapper}>
          <View style={styles.activeTabItem}>
            <Text style={styles.activeTabText}>Who are you shopping for today?</Text>
          </View>
        </View>

        {/* --- Animal Category Circle Scroll --- */}
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

        {/* --- Products Grid (Pet Food) --- */}
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
                <Image source={{ uri: product.image }} style={styles.productImg} resizeMode="contain" />
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

        {/* --- Pet Accessories Section --- */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridTitle}>Pet Accessories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {accessories.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.productCard, { backgroundColor: item.color }]}>
              <View style={styles.imagePlaceholder}>
                <Image source={{ uri: item.image }} style={styles.productImg} resizeMode="contain" />
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.brandName}>{item.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>{item.price}</Text>
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
    height: 100,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1C1C1E" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  wishlistBtn: {
    borderWidth: 1.5,
    borderColor: MAIN_ORANGE,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  wishlistText: { color: MAIN_ORANGE, fontSize: 13, fontWeight: "700" },
  cartBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    height: 50,
  },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: "#1C1C1E" },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: MAIN_ORANGE,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: MAIN_ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  // --- Explore Section ---
  exploreSection: { marginTop: 25, paddingHorizontal: 20 },
  exploreTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 15 },
  exploreScroll: { flexDirection: "row" },
  exploreItem: { alignItems: "center", marginRight: 18, width: 80 },
  exploreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF5E6", // ලා තැඹිලි පසුබිමක්
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE0B3",
  },
  exploreLabel: { marginTop: 8, fontSize: 12, fontWeight: "600", color: "#444", textAlign: "center" },
  // --- Shopping For Tab ---
  tabWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  activeTabItem: { alignItems: "flex-start" },
  activeTabText: { fontSize: 20, fontWeight: "900", color: "#1A1A1A" },
  dotIndicator: { width: 25, height: 4, borderRadius: 2, backgroundColor: MAIN_ORANGE, marginTop: 4 },
  catScroll: { marginTop: 20, paddingLeft: 20 },
  catItem: { alignItems: "center", marginRight: 22 },
  catCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeCatCircle: { borderColor: MAIN_ORANGE, backgroundColor: "#FFF", elevation: 4 },
  emojiStyle: { fontSize: 30 },
  catLabel: { marginTop: 8, fontSize: 14, fontWeight: "600", color: "#8E8E93" },
  activeCatLabel: { color: MAIN_ORANGE, fontWeight: "800" },
  gridHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 35,
    marginBottom: 15,
  },
  gridTitle: { fontSize: 19, fontWeight: "800", color: "#1C1C1E" },
  seeAllText: { color: MAIN_ORANGE, fontWeight: "700" },
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
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: { width: "85%", height: "85%" },
});

export default ShopScreen;