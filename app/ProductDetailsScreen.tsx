import React, { useState } from "react";
import {
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ScrollView, SafeAreaView, StatusBar, Dimensions, Platform
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/productSlice";

const { height } = Dimensions.get("window");
const MAIN_ORANGE = "#FF8C00";

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const [selectedWeight, setSelectedWeight] = useState("4kg");

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Header Section */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product Details</Text>
            <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate("Cart")}>
            <MaterialCommunityIcons name="cart-outline" size={26} color={MAIN_ORANGE} />
            </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 2. Scrollable Body */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={[styles.imageSection, { backgroundColor: product.color || "#FFEBEE" }]}>
          <Image source={{ uri: product.image }} style={styles.productImg} resizeMode="contain" />
          <View style={styles.paginationDots}>
             <View style={[styles.dot, styles.activeDot]} />
             <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.refillBadge}>
               <Text style={styles.refillText}>Refill</Text>
            </View>
          </View>

          <Text style={styles.priceText}>{product.price}</Text>

          <View style={styles.weightRow}>
            {["4kg", "10kg", "15kg"].map((weight) => (
              <TouchableOpacity 
                key={weight}
                style={[styles.weightBtn, selectedWeight === weight && styles.activeWeightBtn]}
                onPress={() => setSelectedWeight(weight)}
              >
                <Text style={[styles.weightBtnText, selectedWeight === weight && styles.activeWeightText]}>
                  {weight}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Description</Text>
            <Text style={styles.descContent}>
              {product.brand} put the animal first in everything they do. Every decision they make is 
              based on years of study in their own centre and on partnerships with veterinary 
              schools, universities and breeders.
            </Text>
          </View>
          
          {/* ScrollView එකේ අන්තිම කොටස Bottom Bar එකට යට නොවෙන්න අමතර ඉඩක් */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* 3. Floating Bottom Bar */}
      {/* මෙය Tab Bar එකට ඉහළින් හරියටම පිහිටයි */}
      <View style={styles.bottomBarWrapper}>
        <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconBtn}>
                <MaterialCommunityIcons name="share-variant" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.iconBtn, styles.heartBtn]}>
                <MaterialCommunityIcons name="heart-outline" size={24} color={MAIN_ORANGE} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
                <MaterialCommunityIcons name="cart-plus" size={22} color="#FFF" />
                <Text style={styles.addText}>Add to cart</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "#FFF" },
  safeHeader: { backgroundColor: "#FFF" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    height: 100,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  cartBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  
  scrollContainer: { flex: 1 },
  imageSection: { width: "100%", height: 280, justifyContent: "center", alignItems: "center" },
  productImg: { width: "80%", height: "80%" },
  paginationDots: { flexDirection: 'row', position: 'absolute', bottom: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF', marginHorizontal: 4, opacity: 0.5 },
  activeDot: { opacity: 1, width: 20 },
  
  detailsContainer: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { fontSize: 20, fontWeight: "900", color: "#1A1A1A", flex: 1, marginRight: 10 },
  refillBadge: { borderWidth: 1, borderColor: MAIN_ORANGE, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  refillText: { color: MAIN_ORANGE, fontWeight: "700", fontSize: 11 },
  priceText: { fontSize: 24, fontWeight: "900", color: MAIN_ORANGE, marginVertical: 10 },
  
  weightRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  weightBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 15, backgroundColor: "#F7F7F7", borderWidth: 1, borderColor: "#EEE" },
  activeWeightBtn: { backgroundColor: MAIN_ORANGE, borderColor: MAIN_ORANGE },
  weightBtnText: { fontWeight: "700", color: "#1A1A1A" },
  activeWeightText: { color: "#FFF" },
  
  descSection: { marginTop: 5 },
  descTitle: { fontSize: 17, fontWeight: "800", color: "#1A1A1A", marginBottom: 5 },
  descContent: { fontSize: 14, color: "#666", lineHeight: 20 },

  // --- අලුත් Bottom Bar Styles ---
  bottomBarWrapper: {
    bottom: 80, // මෙය 0 කළ විට Tab Bar එකට උඩින් සෙට් වේ
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    // Screen එකේ පහළම Tab bar එක තිබේ නම් මෙහි bottom padding වැඩි කරන්න
    paddingBottom: Platform.OS === 'ios' ? 55 : 35, 
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: MAIN_ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: MAIN_ORANGE,
  },
  addBtn: {
    flex: 1,
    height: 48,
    backgroundColor: MAIN_ORANGE,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  }
});

export default ProductDetailsScreen;