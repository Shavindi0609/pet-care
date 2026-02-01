import React, { useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, TextInput, Image, ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store"; 
import { setProviders, setLoading } from '../redux/providerSlice';

const ServiceProvidersScreen = ({ route, navigation }: any) => {
  const { serviceName = "Grooming" } = route.params || {};
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState("");

  const { providers, loading } = useSelector((state: RootState) => state.provider);

  useEffect(() => {
    const loadHardcodedData = () => {
      dispatch(setLoading(true));

      // 🛑 Hardcoded Data (පසුව Firestore එකෙන් මේවා ගන්න පුළුවන්)
      const dummyData = [
        {
          id: "1",
          name: "Happy Paws Grooming",
          address: "123 Pet Lane, Colombo 07",
          category: "Grooming",
          image: "https://api.dicebear.com/7.x/bottts/png?seed=vet1",
        },
        {
          id: "2",
          name: "City Vet Hospital",
          address: "456 Main Street, Kandy",
          category: "Veterinary",
          image: "https://api.dicebear.com/7.x/bottts/png?seed=vet2",
        },
        {
          id: "3",
          name: "Pet Transit Express",
          address: "789 Speed Way, Gampaha",
          category: "Transportation",
          image: "https://api.dicebear.com/7.x/bottts/png?seed=vet3",
        },
        {
          id: "4",
          name: "Elite Pet Boarding",
          address: "Zone 56 Building 23, Doha",
          category: "Boarding",
          image: "https://api.dicebear.com/7.x/bottts/png?seed=vet4",
        }
      ];

      // දැනට තෝරාගෙන තියෙන category එකට විතරක් filter කරලා දත්ත ටික Redux එකට දානවා
      const filteredData = dummyData.filter(item => item.category === serviceName);
      
      dispatch(setProviders(filteredData));
      dispatch(setLoading(false));
    };

    loadHardcodedData();
  }, [serviceName, dispatch]);

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{serviceName}</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cart-outline" size={28} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by provider"
            placeholderTextColor="#A1A1A1"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchIconBtn}>
            <MaterialCommunityIcons name="magnify" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {filteredProviders.map((item: any) => (
            <View key={item.id} style={styles.providerCard}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.providerImage} />
              </View>

              <View style={styles.infoWrapper}>
                <Text style={styles.providerName}>{item.name}</Text>
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons name="directions" size={18} color="#FF8C00" />
                  <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.bookBtn}
                  onPress={() => navigation.navigate("AddAppointment", { providerName: item.name, serviceName })}
                >
                  <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {filteredProviders.length === 0 && (
            <View style={styles.noDataBox}>
               <MaterialCommunityIcons name="emoticon-sad-outline" size={50} color="#CCC" />
               <Text style={styles.noDataText}>No {serviceName} providers available</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// Styles කලින් දුන්න ඒවාමයි...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 100 },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF8E1', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#5D4037' },
  searchSection: { paddingHorizontal: 20, marginBottom: 20 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#F5F5F7', borderRadius: 15, alignItems: 'center', paddingLeft: 10 },
  searchInput: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#1A1A1A' },
  searchIconBtn: { backgroundColor: '#FFB300', padding: 10, borderRadius: 12, margin: 5 },
  providerCard: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  imageWrapper: { width: 90, height: 90, backgroundColor: '#F9F9F9', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  providerImage: { width: 70, height: 70, borderRadius: 10, resizeMode: 'cover' },
  infoWrapper: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  providerName: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  addressText: { flex: 1, fontSize: 13, color: '#666', marginLeft: 5, lineHeight: 18 },
  bookBtn: { backgroundColor: '#FFB300', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  bookBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataBox: { marginTop: 50, alignItems: 'center' },
  noDataText: { marginTop: 10, color: '#999', fontSize: 16 }
});

export default ServiceProvidersScreen;