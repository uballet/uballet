import { Slot, Stack } from "expo-router";
import { SafeAreaView, Text, View, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useCallback, useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { useAddContact } from "../../../hooks/contacts/useAddContact";

function ContactsLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  //const [address, setAddress] = useState<`0x${string}`>("0x");
  const [address, setAddress] = useState("");
  const { addNewContact, isSuccess } = useAddContact();

  const updateAddress = useCallback((address: string) => {
    // if (address.startsWith("0x") || address.startsWith("0X")) {
    //   setAddress(`0x${address.slice(2)}`);
    // }
    setAddress(address);
  }, []);

  const onPress = useCallback(() => {
    console.log("Adding new contact...");
    addNewContact({ name, address });
    setModalVisible(false);
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
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
            />
            <TextInput
              placeholder="ETH Address or ENS Name"
              value={address}
              onChangeText={updateAddress}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />

            <View className="flex-row justify-between">
              <Button
                onPress={() => setModalVisible(false)}
                buttonColor="gray"
                className="flex-1 mr-2 rounded-lg px-4 py-2"
              >
                <Text className="text-white">Cancel</Text>
              </Button>

              <Button
                onPress={onPress}
                buttonColor="#277ca5"
                className="flex-1 ml-2 rounded-lg px-4 py-2"
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
