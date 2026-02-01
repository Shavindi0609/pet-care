import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { db, auth } from "../config/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyAppointmentsScreen = ({ navigation }: any) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore එකෙන් Appointments ලබා ගැනීම
  const fetchAppointments = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc") // අලුත්ම ඒවා උඩට එන විදිහට
      );

      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(list);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Status එක අනුව පාට වෙනස් කරන function එකක්
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FFB300';
      case 'confirmed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#757575';
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <MaterialCommunityIcons name="dog-service" size={24} color="#FF8C00" />
          <Text style={styles.serviceName}>{item.serviceType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="paw" size={18} color="#5D4037" />
          <Text style={styles.detailText}>Pet: **{item.petName}**</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="storefront-outline" size={18} color="#5D4037" />
          <Text style={styles.detailText}>Provider: {item.providerName}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar-clock" size={18} color="#5D4037" />
          <Text style={styles.detailText}>{item.date} | {item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#5D4037" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <TouchableOpacity onPress={fetchAppointments} style={styles.refreshBtn}>
          <MaterialCommunityIcons name="refresh" size={24} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFB300" />
        </View>
      ) : appointments.length > 0 ? (
<FlatList
  data={appointments}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.listContent}
  
  // 1. පහළට ඇදලා refresh කරන්න (Pull to Refresh)
  onRefresh={fetchAppointments}
  refreshing={loading}
  
  // 2. Scroll bar එක පෙන්වන්න අවශ්‍ය නම් (optional)
  showsVerticalScrollIndicator={true}
  
  // 3. Appointment එකක්වත් නැති වෙලාවට පෙන්නන Empty Component එක (Optional but good)
  ListEmptyComponent={
    !loading ? (
      <View style={styles.center}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={80} color="#CCC" />
        <Text style={styles.noDataText}>No appointments found.</Text>
      </View>
    ) : null
  }
/>
      ) : (
        <View style={styles.center}>
          <MaterialCommunityIcons name="calendar-blank-outline" size={80} color="#CCC" />
          <Text style={styles.noDataText}>No appointments found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    height: 120, 
    backgroundColor: '#FFF' 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FFF8E1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#5D4037' },
  refreshBtn: { padding: 5 },
 listContent: { 
    padding: 20, 
    paddingBottom: 100 // 👈 මෙතනට වැඩිපුර ඉඩක් දෙන්න (Navigation bar එකේ උස අනුව)
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10
  },
  serviceInfo: { flexDirection: 'row', alignItems: 'center' },
  serviceName: { fontSize: 18, fontWeight: '700', color: '#5D4037', marginLeft: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  detailsContainer: { gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: 14, color: '#6D4C41', marginLeft: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#999', marginTop: 10 },
});

export default MyAppointmentsScreen;