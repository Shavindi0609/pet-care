import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView,Modal, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { incrementQty, decrementQty, removeFromCart } from "../redux/cartSlice";
import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebase"; // auth import කරන්න
import { saveCartToFirestore } from "../services/cartService"; // save function එක ගන්න
import { RootState } from "../store"; // RootState එක import කරගන්න
import { clearCart } from "../redux/cartSlice";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MAIN_ORANGE = "#FF8C00";

const CartScreen = ({ navigation }: any) => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) || [];
  const dispatch = useDispatch();

  const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        address: "",
        phone: ""
    });

    // CartScreen.tsx ඇතුළත මෙහෙම කරන්න
    useEffect(() => {
    const user = auth.currentUser;
    // Firestore එකෙන් data ටික Redux එකට එනකම් පොඩි වෙලාවක් යන නිසා
    // අපි save කරන්නේ cart එකේ බඩු තියෙනවා නම් විතරයි.
    if (user && cartItems.length > 0) {
        saveCartToFirestore(user.uid, cartItems);
    }
    }, [cartItems]);


    // මුළු මුදල ගණනය කිරීම
    const totalPrice = cartItems.reduce((acc: number, item: any) => {
        // Price string එකේ ඇති සංකේත අයින් කර අගය ලබා ගැනීම
        const priceValue = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
        return acc + (priceValue * item.quantity);
    }, 0);

// 2. ප්‍රධාන Function එක: Confirm Order කරද්දී වැඩ කරන Logic එක
  const handleCheckout = async () => {
    // Validation: විස්තර පුරවලා නැත්නම් Error එකක් පෙන්වනවා
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      Alert.alert("Error", "Please fill all the details to place the order.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Please login to place an order.");
      return;
    }

    try {
      // Step A: Firestore එකේ 'orders' collection එකට දත්ත යැවීම
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        deliveryAddress: customerInfo.address,
        items: cartItems,          // මෙතන තමයි ඔක්කොම බඩු ලිස්ට් එක යන්නේ
        totalAmount: totalPrice.toFixed(2),
        status: "Pending",         // Admin ට බලන්න ලේසි වෙන්න status එකක්
        createdAt: serverTimestamp(), // Order එක දාපු වෙලාව
      });

      // Step B: Redux එකේ තියෙන Cart එක clear කිරීම
      dispatch(clearCart());

      // Step C: Success message එක දී Modal එක වසා දැමීම
      Alert.alert(
        "Order Placed! 🐾", 
        "Thank you for your purchase. We will deliver your items soon!",
        [{ text: "OK", onPress: () => setOrderModalVisible(false) }]
      );

    } catch (error) {
      console.error("Firestore Order Error: ", error);
      Alert.alert("Error", "Could not place order. Please try again.");
    }
  };

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

          <View style={styles.footer}>
        <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>

        {/* මෙන්න මේ Button එකට තමයි Modal එක open කරන්න onPress එක දෙන්න ඕනේ */}
        <TouchableOpacity 
            style={styles.checkoutBtn} 
            onPress={() => setOrderModalVisible(true)} // 👈 මේක අනිවාර්යයි!
        >
            <Text style={styles.checkoutText}>Checkout Now</Text>
        </TouchableOpacity>
        </View>
        </>

        
      )}

{/* ---------------------------------------------------- */}
      {/* Order Form Modal එක මෙන්න මෙතනට දාන්න (SafeAreaView එකට ඇතුළෙන්) */}
      <Modal visible={orderModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Details 🚚</Text>
              <TouchableOpacity onPress={() => setOrderModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput  
                style={styles.formInput}  
                placeholder="Enter your name"
                value={customerInfo.name}
                onChangeText={(txt) => setCustomerInfo({...customerInfo, name: txt})}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput  
                style={styles.formInput}  
                placeholder="07X XXX XXXX"
                keyboardType="phone-pad"
                value={customerInfo.phone}
                onChangeText={(txt) => setCustomerInfo({...customerInfo, phone: txt})}
              />

              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput  
                style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}  
                placeholder="Enter full address"
                multiline
                value={customerInfo.address}
                onChangeText={(txt) => setCustomerInfo({...customerInfo, address: txt})}
              />

              <View style={styles.orderSummary}>
                <Text style={styles.summaryText}>Total Amount: ${totalPrice.toFixed(2)}</Text>
              </View>

            {/* Modal එක ඇතුළේ තියෙන කොටස */}
            <TouchableOpacity 
            style={styles.confirmBtn} // Confirm style එක පාවිච්චි කරන්න
            onPress={handleCheckout}  // 👈 මේකෙන් තමයි Order එක Save වෙන්නේ
            >
            <Text style={styles.confirmBtnText}>Confirm Order</Text>
            </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* ---------------------------------------------------- */}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 35 },
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
  footer: { padding: 115, borderTopWidth: 1, borderTopColor: "#F2F2F7" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  totalLabel: { fontSize: 16, color: "#8E8E93", fontWeight: "600" },
  totalValue: { fontSize: 22, fontWeight: "900", color: "#1A1A1A" },
  checkoutBtn: { backgroundColor: MAIN_ORANGE, padding: 18, borderRadius: 20, alignItems: "center" },
  checkoutText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  emptyContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#8E8E93", marginTop: 10 },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // පසුබිම අඳුරු කරන්න
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    height: '75%', // Screen එකෙන් 75% ක් උස
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 8,
    marginTop: 15,
  },
  formInput: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  orderSummary: {
    backgroundColor: '#FFF8F0',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    borderWidth: 1,
    borderColor: MAIN_ORANGE,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: MAIN_ORANGE,
    textAlign: 'center',
  },
  confirmBtn: {
    backgroundColor: MAIN_ORANGE,
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  }
});

export default CartScreen;