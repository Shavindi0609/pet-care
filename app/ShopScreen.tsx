import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, SafeAreaView, StatusBar,
  Image, ActivityIndicator, Alert
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Services සහ Redux Actions
import { subscribeToProducts } from "../services/shopService"; // subscribe function එක import කරන්න
import { setProducts, addToCart } from "../redux/productSlice";
import { RootState } from "../store";

const { width } = Dimensions.get("window");
const MAIN_ORANGE = "#FF8C00";

const ShopScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Redux Store එකෙන් Data ලබා ගැනීම
  const products = useSelector((state: RootState) => state.products.items);
  const cartItems = useSelector((state: RootState) => state.products.cart);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Categories Data
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

  // --- Real-time Firestore Listener ---
  useEffect(() => {
    setLoading(true);

    // subscribeToProducts හරහා Firestore එකට connect වීම
    const unsubscribe = subscribeToProducts(activeCategory, (data) => {
      dispatch(setProducts(data as any));
      setLoading(false);
    });

    // Screen එකෙන් ඉවත් වන විට listener එක නතර කිරීම (Memory leak වැළැක්වීමට)
    return () => unsubscribe();
  }, [activeCategory, dispatch]);

  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
    // මෙතන Alert එකක් වෙනුවට Toast එකක් දැම්මොත් වඩාත් ලස්සනයි
  };

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
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate("Cart")}>
            <MaterialCommunityIcons name="cart-outline" size={26} color={MAIN_ORANGE} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
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
          <TouchableOpacity 
            style={styles.filterBtn} 
            onPress={() => navigation.navigate("AddProduct")}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --- Explore Popular Categories --- */}
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

        <View style={styles.tabWrapper}>
            <Text style={styles.activeTabText}>Who are you shopping for today?</Text>
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

        {/* --- Products Grid --- */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridTitle}>Top Products for {activeCategory}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={MAIN_ORANGE} style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product: any) => (
                <TouchableOpacity 
                  key={product.id} 
                  style={[styles.productCard, { backgroundColor: product.color || "#F2F2F7" }]}
                  onPress={() => navigation.navigate("ProductDetails", { product })}
                >
                  <View style={styles.imagePlaceholder}>
                    <Image source={{ uri: product.image }} style={styles.productImg} resizeMode="contain" />
                  </View>
                  <View style={styles.productDetails}>
                    <Text style={styles.brandName}>{product.brand}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>{product.price}</Text>
                      <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(product)}>
                        <MaterialCommunityIcons name="plus" size={18} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
                <Text style={{ color: '#8E8E93' }}>No products found in this category.</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 150 }, // Tab bar එකට ඉඩ තැබීමට වැඩි කළා
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 120 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F2F2F7", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1C1C1E" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  wishlistBtn: { borderWidth: 1.5, borderColor: MAIN_ORANGE, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  wishlistText: { color: MAIN_ORANGE, fontSize: 13, fontWeight: "700" },
  cartBtn: { width: 45, height: 45, justifyContent: "center", alignItems: "center" },
  cartBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#FF3B30', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  searchSection: { flexDirection: "row", paddingHorizontal: 20, marginTop: 10, gap: 12 },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#F2F2F7", borderRadius: 15, height: 50 },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: "#1C1C1E" },
  filterBtn: { width: 50, height: 50, backgroundColor: MAIN_ORANGE, borderRadius: 15, justifyContent: "center", alignItems: "center", elevation: 5 },
  exploreSection: { marginTop: 25, paddingHorizontal: 20 },
  exploreTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 15 },
  exploreScroll: { flexDirection: "row" },
  exploreItem: { alignItems: "center", marginRight: 18, width: 80 },
  exploreCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FFF5E6", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#FFE0B3" },
  exploreLabel: { marginTop: 8, fontSize: 12, fontWeight: "600", color: "#444", textAlign: "center" },
  tabWrapper: { paddingHorizontal: 20, marginTop: 30 },
  activeTabText: { fontSize: 20, fontWeight: "900", color: "#1A1A1A" },
  catScroll: { marginTop: 20, paddingLeft: 20 },
  catItem: { alignItems: "center", marginRight: 22 },
  catCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#F8F8F8", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "transparent" },
  activeCatCircle: { borderColor: MAIN_ORANGE, backgroundColor: "#FFF", elevation: 4 },
  emojiStyle: { fontSize: 30 },
  catLabel: { marginTop: 8, fontSize: 14, fontWeight: "600", color: "#8E8E93" },
  activeCatLabel: { color: MAIN_ORANGE, fontWeight: "800" },
  gridHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginTop: 35, marginBottom: 15 },
  gridTitle: { fontSize: 19, fontWeight: "800", color: "#1C1C1E" },
  seeAllText: { color: MAIN_ORANGE, fontWeight: "700" },
  productGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 15, justifyContent: "space-between" },
  productCard: { width: (width - 50) / 2, borderRadius: 25, marginBottom: 20, padding: 10 },
  imagePlaceholder: { height: 130, backgroundColor: "#FFF", borderRadius: 20, justifyContent: "center", alignItems: "center", overflow: 'hidden' },
  productImg: { width: "85%", height: "85%" },
  productDetails: { padding: 8 },
  brandName: { fontSize: 11, fontWeight: "600", color: "#8E8E93", marginBottom: 2 },
  productName: { fontSize: 13, fontWeight: "700", color: "#1C1C1E", height: 36 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  priceText: { fontSize: 15, fontWeight: "900", color: "#1C1C1E" },
  addBtn: { width: 30, height: 30, borderRadius: 10, backgroundColor: "#1A1A1A", justifyContent: "center", alignItems: "center" },
});

export default ShopScreen;