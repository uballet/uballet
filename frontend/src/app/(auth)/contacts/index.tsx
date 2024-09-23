import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useContacts } from "../../../hooks/contacts/useContacts";
import { ActivityIndicator } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback } from "react";
import { useDeleteContact } from "../../../hooks/contacts/useDeleteContact";
import { router } from "expo-router";
import { useAccountContext } from "../../../hooks/useAccountContext";
import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_API_URL } from "../../../env";

function ContactsScreen() {
  const { contacts, isLoading } = useContacts();
  const { deleteContactMutate, isPending } = useDeleteContact();
  const { sdkClient } = useAccountContext();

  const resolveName = useCallback(
    async (address: string) => {
      // Using Alchemy SDK to resolve ENS names with the Alchemy API in the mainnet network
      if (ALCHEMY_API_URL === undefined) {
        throw new Error("ALCHEMY_API_URL is not defined");
      }
      const alchemyApiEthMainnetUrl = ALCHEMY_API_URL.replace(
        "eth-sepolia",
        "eth-mainnet"
      );
      const sdkMainnet = new Alchemy({
        url: alchemyApiEthMainnetUrl,
        network: Network.ETH_MAINNET,
      });

      try {
        const ensResolve = await sdkMainnet.core.resolveName(address);
        console.log("ENS Resolve:", ensResolve);
        if (ensResolve) {
          return ensResolve;
        } else {
          const hexaAdress: `0x${string}` = address.startsWith("0x")
            ? (address as `0x${string}`)
            : (`0x${address}` as `0x${string}`);
          return hexaAdress;
        }
      } catch (e) {
        console.warn("Error resolving name:", e, "Falling back to address");
        const hexaAdress: `0x${string}` = address.startsWith("0x")
          ? (address as `0x${string}`)
          : (`0x${address}` as `0x${string}`);
        return hexaAdress;
      }
    },
    [sdkClient]
  );

  const onDelete = useCallback(
    (id: string) => {
      console.log("Deleting contact", id);
      deleteContactMutate({ contactId: id });
    },
    [deleteContactMutate]
  );

  const renderNoContacts = useCallback(() => {
    if (contacts?.length) {
      return null;
    }
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <MaterialIcons name="contacts" size={80} color="gray" />
        <Text className="text-xl font-semibold text-gray-600 mt-4">
          No Contacts Found
        </Text>
        <Text className="text-md text-gray-500 mt-2 text-center px-8">
          You haven't added any contacts yet. Add new contacts to manage your
          transfers easily.
        </Text>
      </View>
    );
  }, [contacts]);

  const renderContacts = useCallback(() => {
    if (!contacts?.length) {
      return null;
    }
    return (
      <ScrollView>
        <View className="flex-1 w-full bg-gray-100 p-4">
          {contacts.map((contact) => (
            <Pressable
              key={contact.id}
              onPress={async () => {
                const resolvedAddress = await resolveName(contact.address);
                router.navigate({
                  pathname: "/(auth)/(tabs)/transfer",
                  params: { address: resolvedAddress },
                });
              }}
              className="mb-2 bg-white border border-gray-300 rounded-lg shadow-md p-3 flex-row items-center"
              android_ripple={{ color: "rgba(0,0,0,0.1)" }} // Ripple effect for Android
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {contact.name}
                </Text>
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  className="text-sm text-gray-600"
                >
                  {contact.address}
                </Text>
              </View>
              <Pressable onPress={() => onDelete(contact.id)} className="p-2">
                <MaterialIcons name="delete" size={24} color="red" />
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    );
  }, [contacts]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView className="w-full p-2 flex-1">
      <View className="flex-1 w-full">
        {renderContacts()}
        {renderNoContacts()}
      </View>
    </SafeAreaView>
  );
}

export default ContactsScreen;
