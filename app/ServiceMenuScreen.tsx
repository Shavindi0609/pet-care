import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, Dimensions, Image 
} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ServiceMenuScreen = ({ navigation }: any) => {

  const mainServices = [
    { name: "Grooming", icon: "dog-service", color: "#FF8C00", sub: "Hair & Bath" },
    { name: "Boarding", icon: "home-heart", color: "#FF8C00", sub: "Pet Stay" },
    { name: "Transportation", icon: "paw", color: "#FF8C00", sub: "Pet Taxi" },
    { name: "Training", icon: "human-handsup", color: "#FF8C00", sub: "Expert Tips" },
    { name: "Pet Care Consultation", icon: "cat", color: "#FF8C00", sub: "Expert Advice" },
    { name: "My Appointments", icon: "calendar-clock", color: "#FF8C00", sub: "Schedules" },
  ];

  const helpfulLinks = [
    { name: "Blog", icon: "newspaper-variant-outline" },
    { name: "Refer & Earn", icon: "ticket-percent-outline" },
    { name: "App Help", icon: "handshake-outline" },
    { name: "Lost Gem", icon: "cat" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#5D4037" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pet Services</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subHeaderText}>Enjoy new smart pet parenting experience</Text>

        {/* Main Services Grid */}
        <View style={styles.gridContainer}>

      {mainServices.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.serviceCard}
          onPress={() => navigation.navigate("ServiceProviders", { serviceName: item.name })} 
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name={item.icon as any} size={40} color="#FF8C00" />
          </View>
          <Text style={styles.serviceName}>{item.name}</Text>
        </TouchableOpacity>
      ))}

        </View>

        {/* Other Helpful Links Section */}
        <View style={styles.helpfulSection}>
          <Text style={styles.sectionTitle}>Other Helpful Links</Text>
          <View style={styles.linksRow}>
            {helpfulLinks.map((link, index) => (
              <View key={index} style={styles.linkItem}>
                <TouchableOpacity style={styles.linkCircle}>
                  <MaterialCommunityIcons name={link.icon as any} size={28} color="#D4AF37" />
                </TouchableOpacity>
                <Text style={styles.linkText}>{link.name}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    height: 100 
  },
  backBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: '#FFF8E1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#5D4037' },
  subHeaderText: { 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#1A1A1A', 
    fontWeight: '600', 
    marginTop: 0,
    marginBottom: 30 
  },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 15, 
    justifyContent: 'space-between' 
  },
  serviceCard: {
    width: (width / 2) - 25,
    backgroundColor: '#FFFDF5',
    borderRadius: 20,
    paddingVertical: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFF3E0',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 2,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  serviceName: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#1A1A1A', 
    textAlign: 'center',
    paddingHorizontal: 5
  },
  helpfulSection: {
    backgroundColor: '#F9F9F9',
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 20,
    marginTop: 10
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#000', marginBottom: 20 },
  linksRow: { flexDirection: 'row', justifyContent: 'space-between' },
  linkItem: { alignItems: 'center', width: '25%' },
  linkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  linkText: { fontSize: 12, color: '#444', fontWeight: '600', textAlign: 'center' }
});

export default ServiceMenuScreen;