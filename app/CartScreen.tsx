import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { incrementQty, decrementQty, removeFromCart } from "../redux/productSlice";

const MAIN_ORANGE = "#FF8C00";

const CartScreen = ({ navigation }: any) => {
  const cartItems = useSelector((state: any) => state.products.cart);
  const dispatch = useDispatch();

  // මුළු මුදල ගණනය කිරීම
  const totalPrice = cartItems.reduce((acc: number, item: any) => {
    // Price එක string එකක් නිසා "$" හෝ "Rs" අයින් කර Number එකක් කරගන්නවා
    const priceValue = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
    return acc + (priceValue * item.quantity);
  }, 0);

  const renderCartItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.product.image }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.product.name}</Text>
        <Text style={styles.brand}>{item.product.brand}</Text>
        <Text style={styles.price}>{item.product.price}</Text>
        
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => dispatch(decrementQty(item.product.id))} style={styles.qtyBtn}>
            <MaterialCommunityIcons name="minus" size={18} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => dispatch(incrementQty(item.product.id))} style={styles.qtyBtn}>
            <MaterialCommunityIcons name="plus" size={18} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => dispatch(removeFromCart(item.product.id))} style={styles.deleteBtn}>
        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ width: 30 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContent}>
          <MaterialCommunityIcons name="cart-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.product.id}
            contentContainerStyle={{ padding: 20 }}
          />

          {/* Checkout Footer */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Checkout Now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  card: { flexDirection: "row", backgroundColor: "#F8F8F8", borderRadius: 20, padding: 15, marginBottom: 15, alignItems: "center" },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  brand: { fontSize: 12, color: "#8E8E93", marginBottom: 5 },
  price: { fontSize: 16, fontWeight: "900", color: MAIN_ORANGE },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: { width: 30, height: 30, backgroundColor: "#E5E5EA", borderRadius: 15, justifyContent: "center", alignItems: "center" },
  qtyNum: { marginHorizontal: 15, fontSize: 16, fontWeight: "700" },
  deleteBtn: { padding: 5 },
  footer: { padding: 120, borderTopWidth: 1, borderTopColor: "#F2F2F7" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  totalLabel: { fontSize: 16, color: "#8E8E93", fontWeight: "600" },
  totalValue: { fontSize: 22, fontWeight: "900", color: "#1A1A1A" },
  checkoutBtn: { backgroundColor: MAIN_ORANGE, padding: 18, borderRadius: 20, alignItems: "center" },
  checkoutText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  emptyContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#8E8E93", marginTop: 10 }
});

export default CartScreen;