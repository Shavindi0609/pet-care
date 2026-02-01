import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AskFidoScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Woof! I'm Fido, your AI pet assistant. How can I help you today?", sender: "ai" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() === "") return;

    // User message එක ඇඩ් කිරීම
    const newMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages([...messages, newMessage]);
    setInputText("");

    // AI Response එකක් අනුකරණය කිරීම (Simulation)
    setTimeout(() => {
      const aiResponse = { 
        id: (Date.now() + 1).toString(), 
        text: "That sounds interesting! I'm still learning, but I'll do my best to help with your pet queries.", 
        sender: "ai" 
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask Fido AI</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, item.sender === "user" ? styles.userText : styles.aiText]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about pets..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <MaterialCommunityIcons name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#F2F2F7" },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  chatList: { padding: 20 },
  messageBubble: { padding: 15, borderRadius: 20, marginBottom: 10, maxWidth: "80%" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#FF8C00" },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#F2F2F7" },
  messageText: { fontSize: 15 },
  userText: { color: "#FFF" },
  aiText: { color: "#1C1C1E" },
  inputContainer: { flexDirection: "row", padding: 15, alignItems: "center", borderTopWidth: 1, borderTopColor: "#F2F2F7" },
  input: { flex: 1, backgroundColor: "#F8F8F8", borderRadius: 25, paddingHorizontal: 20, height: 50, marginRight: 10 },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#FF8C00", justifyContent: "center", alignItems: "center" },
});

export default AskFidoScreen;