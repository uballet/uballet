import { Slot, Stack, useRouter } from "expo-router";
import { SafeAreaView, Text, View, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useCallback, useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { useAddContact } from "../../../hooks/contacts/useAddContact";

function ContactsLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();
  const { addNewContact, isSuccess } = useAddContact();

  const updateAddress = useCallback((address: string) => {
    setAddress(address);
  }, []);

  const onAddNewContact = useCallback(() => {
    console.log("Adding new contact...");
    addNewContact({ name, address });
    setModalVisible(false);
    setName("");
    setAddress("");
  }, [addNewContact, name, address]);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Stack.Screen
        options={{
          title: "Contacts",
          headerStyle: { backgroundColor: "#277ca5" },
          headerShown: true,
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <Ionicons
              testID="new-contact-header-button"
              name="add-circle-outline"
              size={36}
              color="white"
              onPress={() => setModalVisible(true)}
            ></Ionicons>
          ),
        }}
      />
      {/* Floating Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-10/12 bg-white rounded-lg shadow-lg p-6">
            <Text className="text-xl font-bold mb-4 text-center text-gray-800">
              Add New Contact
            </Text>

            <TextInput
              testID="new-contact-name-input"
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
            />
            <TextInput
              testID="new-contact-address-input"
              placeholder="ETH Address or ENS Name"
              value={address}
              onChangeText={updateAddress}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />

            <View className="flex-row justify-between">
              <Button
                testID="cancel-new-contact-button"
                onPress={() => setModalVisible(false)}
                buttonColor="gray"
                className="mr-2 rounded-lg px-4 py-2"
              >
                <Text className="text-white">Cancel</Text>
              </Button>

              <Button
                testID="submit-new-contact-button"
                onPress={onAddNewContact}
                buttonColor="#277ca5"
                className="ml-2 rounded-lg px-4 py-2"
              >
                <Text className="text-white ">Add Contact</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main content (from index.tsx) */}
      <Slot />
    </SafeAreaView>
  );
}

export default ContactsLayout;
