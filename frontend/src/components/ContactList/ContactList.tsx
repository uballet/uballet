import React, { useCallback } from 'react';
import { ScrollView, View, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDeleteContact } from "../../hooks/contacts/useDeleteContact";
import { router } from "expo-router";

interface ContactListProps {
  contacts: { id: string; name: string; address: string }[];
  resolveName: (address: string) => Promise<string>;
  isPending: boolean;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, resolveName }) => {
  const { deleteContactMutate } = useDeleteContact();

  const onDelete = useCallback((id: string) => {
    deleteContactMutate({ contactId: id });
  }, [deleteContactMutate]);

  if (!contacts.length) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <MaterialIcons name="contacts" size={80} color="gray" />
        <Text className="text-xl font-semibold text-gray-600 mt-4">No Contacts Found</Text>
        <Text className="text-md text-gray-500 mt-2 text-center px-8">
          You haven't added any contacts yet. Add new contacts to manage your transfers easily.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View className="flex-1 w-full p-4">
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
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          >
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{contact.name}</Text>
              <Text adjustsFontSizeToFit numberOfLines={1} className="text-sm text-gray-600">
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
};

export default ContactList;
