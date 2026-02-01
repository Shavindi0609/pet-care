import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ServiceDetailsScreen = ({ route, navigation }: any) => {
  // මෙතනදී params නැති වුණොත් default values ගන්නවා
  const { 
    serviceName = "Pet Services", 
    icon = "paw", 
    subText = "All round care" 
  } = route.params || {}; // 👈 මේ fallback එක වැදගත්

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{serviceName}</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image Area */}
        <View style={styles.imageContainer}>
          <View style={styles.iconCircle}>
             <MaterialCommunityIcons name={icon} size={80} color="#FF8C00" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{serviceName} Services</Text>
          <Text style={styles.description}>
            Professional {serviceName.toLowerCase()} for your beloved pets. We provide the best {subText.toLowerCase()} 
            care with our expert team to ensure your pet stays happy and healthy.
          </Text>

          {/* Features */}
          <Text style={styles.subTitle}>What's Included:</Text>
          {["Professional Staff", "Safe Environment", "Affordable Prices", "Personalized Care"].map((item, index) => (
            <View key={index} style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>{item}</Text>
            </View>
          ))}

          {/* Booking Button */}
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Book an Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 110 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  imageContainer: { height: 200, backgroundColor: '#FFF5E6', justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  content: { padding: 25 },
  title: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', marginBottom: 10 },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 25 },
  subTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  featureText: { fontSize: 16, color: '#444' },
  bookBtn: { backgroundColor: '#FF8C00', paddingVertical: 18, borderRadius: 20, marginTop: 15, alignItems: 'center' },
  bookBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
});

export default ServiceDetailsScreen;