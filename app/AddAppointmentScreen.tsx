import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from "../config/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../redux/appointmentSlice';
import { setPets } from '../redux/petSlice'; 
import { RootState } from "../store"; 
import { addAppointmentInFirestore } from '../services/appointmentService';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AddAppointmentScreen = ({ route, navigation }: any) => {
  const { providerName, serviceName } = route.params || { providerName: "Provider", serviceName: "Service" };
  const dispatch = useDispatch();
  
  const loading = useSelector((state: RootState) => state.appointment?.loading);
  const myPets = useSelector((state: RootState) => state.pets.pets);

  const [selectedPet, setSelectedPet] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isFetching, setIsFetching] = useState(false);


  useEffect(() => {
    const fetchPetsIfNeeded = async () => {
      const user = auth.currentUser;
      if (user && myPets.length === 0) {
        setIsFetching(true);
        try {
          const q = query(collection(db, "pets"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const petsList: any[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            petsList.push({ 
              id: doc.id, 
              petName: data.petName, 
              ...data 
            });
          });
          dispatch(setPets(petsList));
        } catch (error) {
          console.error("Error fetching pets: ", error);
        } finally {
          setIsFetching(false);
        }
      }
    };
    fetchPetsIfNeeded();
  }, [dispatch, myPets.length]);

  const handleBooking = async () => {
    if (!selectedPet || !date || !time) {
      Alert.alert("Fields Required", "Please make sure all details are filled.");
      return;
    }

    dispatch(setLoading(true));
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Please log in to book an appointment.");

      await addAppointmentInFirestore({
        userId: user.uid,
        petName: selectedPet,
        providerName,
        serviceType: serviceName,
        date,
        time,
        status: "pending",
      });

      Alert.alert(
        "Booking Confirmed! 🐾",
        `${selectedPet} has an appointment for ${serviceName} on ${date}.`,
        [{ text: "Great!", onPress: () => navigation.navigate("Home") }]
      );

    } catch (error: any) {
      Alert.alert("Oops!", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Keyboard එක නිසා inputs වැසීම වැළැක්වීමට KeyboardAvoidingView භාවිතා කර ඇත */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={30} color="#5D4037" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Appointment</Text>
          <View style={{ width: 45 }} />
        </View>

        {/* ScrollView එක ඇතුළේ අන්තර්ගතය ඕනෑම වෙලාවක scroll කළ හැක */}
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Keyboard එක තිබියදීම බොත්තම් එබිය හැක
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.card}>
                <View style={styles.headerRow}>
                  <View>
                    <Text style={styles.title}>Book {serviceName}</Text>
                    <Text style={styles.subtitle}>Partner: {providerName}</Text>
                  </View>
                  <MaterialCommunityIcons name="calendar-multiselect" size={40} color="#FF8C00" />
                </View>

                <View style={styles.divider} />

                <Text style={styles.label}>Select Your Pet</Text>
                <View style={styles.pickerContainer}>
                  {isFetching ? (
                    <ActivityIndicator color="#FF8C00" style={{ padding: 15 }} />
                  ) : (
                    <Picker
                      selectedValue={selectedPet}
                      onValueChange={(itemValue) => setSelectedPet(itemValue)}
                      dropdownIconColor="#FF8C00"
                    >
                      <Picker.Item label="Choose a pet" value="" color="#999" />
                      {myPets && myPets.map((pet: any) => (
                        <Picker.Item 
                          key={pet.id} 
                          label={pet.petName} 
                          value={pet.petName} 
                        />
                      ))}
                    </Picker>
                  )}
                </View>

                <Text style={styles.label}>Preferred Date</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="calendar-range" size={20} color="#FF8C00" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="YYYY-MM-DD" 
                    placeholderTextColor="#CCC"
                    value={date} 
                    onChangeText={setDate} 
                  />
                </View>

                <Text style={styles.label}>Preferred Time</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#FF8C00" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. 10:30 AM" 
                    placeholderTextColor="#CCC"
                    value={time} 
                    onChangeText={setTime} 
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.btn, loading && { backgroundColor: '#CCC' }]} 
                  onPress={handleBooking}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.btnText}>Confirm Booking</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: '#FFF8E1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#5D4037' },
  scrollContent: { padding: 20, paddingBottom: 60 }, // පතුලේ ඉඩ තබා ඇත
  card: { 
    backgroundColor: '#FFF', 
    padding: 25, 
    borderRadius: 30, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: '800', color: '#5D4037' },
  subtitle: { fontSize: 15, color: '#FF8C00', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#5D4037', marginBottom: 8, marginLeft: 5 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F7', 
    borderRadius: 15, 
    marginBottom: 20, 
    paddingHorizontal: 15 
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  pickerContainer: { backgroundColor: '#F5F5F7', borderRadius: 15, marginBottom: 20, overflow: 'hidden' },
  btn: { 
    backgroundColor: '#FFB300', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 5
  },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default AddAppointmentScreen;