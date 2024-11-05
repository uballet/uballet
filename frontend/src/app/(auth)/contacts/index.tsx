import React, { useCallback } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useContacts } from '../../../hooks/contacts/useContacts';
import { ActivityIndicator } from 'react-native-paper';
import ContactList from '../../../components/ContactList/ContactList';
import { useENS } from "../../../hooks/useENS";

function ContactsScreen() {
  const { contacts, isLoading } = useContacts();
  const { resolveName } = useENS();

  if (isLoading) return <ActivityIndicator />;

  return (
    <SafeAreaView className="w-full p-2 flex-1">
      <View className="flex-1 w-full">
        <ContactList contacts={contacts ?? []} resolveName={resolveName} isPending={false} />
      </View>
    </SafeAreaView>
  );
}

export default ContactsScreen;
