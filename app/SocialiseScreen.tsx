import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, 
  SafeAreaView, Modal, TextInput, Alert, ActivityIndicator, Dimensions,KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addPostToFirestore, getPostsFromFirestore, Post } from '../services/postService';
import { setPosts, setPostLoading, addNewPost } from '../redux/postSlice';
import { auth } from "../config/firebase";
import { uploadImageToCloudinary } from '../services/cloudinaryService';

const { width } = Dimensions.get('window');

const SocialiseScreen = () => {
  const dispatch = useDispatch();
  
  // Redux state එක ආරක්ෂිතව ලබා ගැනීම
  const { posts, loading } = useSelector((state: any) => state.posts || { posts: [], loading: false });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [pet, setPet] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // පෝස්ට් Load කිරීම
  const loadPosts = async () => {
    dispatch(setPostLoading(true));
    try {
      const data = await getPostsFromFirestore();
      dispatch(setPosts(data));
    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      dispatch(setPostLoading(false));
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 📸 Gallery එකෙන් Image එකක් තෝරාගැනීම
const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      legacy: true, // 👈 Android වල එන "Failed to parse" error එකට මේක තමයි විසඳුම!
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  } catch (error) {
    console.error("Picker Error:", error);
    Alert.alert("Error", "Could not select the image.");
  }
};

const handleAddPost = async () => {
  // 1. Fields චෙක් කිරීම
  if (!status || !pet || !image) {
    Alert.alert("Missing Fields", "Please add a photo and fill all details.");
    return;
  }
  
  dispatch(setPostLoading(true)); // Loading Spinner එක පටන් ගන්නවා
  
  try {
    // 2. Cloudinary එකට රූපය Upload කරලා URL එක ලබා ගැනීම
    console.log("Uploading image to Cloudinary...");
    const cloudinaryUrl = await uploadImageToCloudinary(image);

    if (!cloudinaryUrl) {
      throw new Error("Cloudinary upload failed");
    }

    const user = auth.currentUser?.displayName || "Pet Lover";
    
    // 3. Firestore එකට අලුත් පෝස්ට් එකේ දත්ත යැවීම
    const newPostData = { 
      user, 
      pet, 
      image: cloudinaryUrl, // 👈 දැන් මෙතනට වැටෙන්නේ Cloud URL එක
      status 
    };
    
    const docRef = await addPostToFirestore(newPostData);
    
    // 4. Redux state එක update කිරීම
    dispatch(addNewPost({ id: docRef.id, ...newPostData, likes: 0 }));
    
    // 5. Modal එක වසා පිරිසිදු කිරීම
    setModalVisible(false);
    setStatus(""); 
    setPet(""); 
    setImage(null);
    
    Alert.alert("Success! 🐾", "Your post is live.");
  } catch (e) {
    console.error("Post error:", e);
    Alert.alert("Error", "Something went wrong while posting.");
  } finally {
    dispatch(setPostLoading(false)); // Loading Spinner එක නතර කරනවා
  }
};

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <MaterialCommunityIcons name="account-circle" size={40} color="#FF8C00" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.petName}>with {item.pet}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="heart-outline" size={28} color="#5D4037" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="comment-outline" size={26} color="#5D4037" />
        </TouchableOpacity>
      </View>

      <View style={styles.postContent}>
        <Text style={styles.statusText}>
          <Text style={{ fontWeight: 'bold' }}>{item.user}: </Text>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Pet Community</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <MaterialCommunityIcons name="plus-box" size={32} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      {loading && posts.length === 0 ? (
        <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 20 }} />
      ) : (
        <FlatList 
          data={posts} 
          renderItem={renderPost} 
          keyExtractor={item => item.id || Math.random().toString()} 
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          onRefresh={loadPosts}
          refreshing={loading}
        />
      )}

      {/* Post Add Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            {/* Keyboard එක නැති තැනක් එබුවම keyboard එක hide වෙන්න */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView 
                contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>New Post 🐾</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <MaterialCommunityIcons name="close" size={28} color="#333" />
                  </TouchableOpacity>
                </View>

                <TextInput 
                  style={styles.input} 
                  placeholder="Pet's Name (e.g. Rocky)" 
                  value={pet} 
                  onChangeText={setPet} 
                />
                
                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <MaterialCommunityIcons name="camera-plus-outline" size={50} color="#FF8C00" />
                      <Text style={styles.placeholderText}>Tap to select a photo</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TextInput 
                  style={[styles.input, { height: 120, textAlignVertical: 'top' }]} 
                  placeholder="What are you and your pet up to?" 
                  multiline 
                  value={status} 
                  onChangeText={setStatus} 
                />
                
                <TouchableOpacity 
                  style={[styles.submitBtn, loading && { backgroundColor: '#CCC' }]} 
                  onPress={handleAddPost}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>Post Now</Text>
                  )}
                </TouchableOpacity>

                {/* Keyboard එක එනකොට පල්ලෙහායින් පොඩි ඉඩක් තියන්න */}
                <View style={{ height: 20 }} />
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  screenHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 35, 
    backgroundColor: '#FFF',
    elevation: 2
  },
  screenTitle: { fontSize: 24, fontWeight: '900', color: '#5D4037' },
  addBtn: { padding: 5 },
  listPadding: { paddingBottom: 100 },
  
  // Post Card Styles
  postCard: { backgroundColor: '#FFF', marginBottom: 15, elevation: 1 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontWeight: '700', fontSize: 16, color: '#333' },
  petName: { fontSize: 12, color: '#FF8C00', fontWeight: '600' },
  postImage: { width: width, height: width, resizeMode: 'cover' },
  postActions: { flexDirection: 'row', padding: 12, gap: 15 },
  actionBtn: { padding: 2 },
  postContent: { paddingHorizontal: 15, paddingBottom: 15 },
  statusText: { fontSize: 14, color: '#444', lineHeight: 20 },

  // Modal Styles
  modalContent: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#5D4037' },
  input: { backgroundColor: '#F5F5F7', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 },
  imagePickerBtn: {
    width: '100%',
    height: 250,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderStyle: 'dashed'
  },
  imagePlaceholder: { alignItems: 'center' },
  placeholderText: { marginTop: 10, color: '#666', fontWeight: '600' },
  previewImage: { width: '100%', height: '100%' },
  submitBtn: { 
    backgroundColor: '#FF8C00', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    marginTop: 10,
    elevation: 3
  },
  submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default SocialiseScreen;