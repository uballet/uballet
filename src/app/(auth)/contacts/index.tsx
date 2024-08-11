import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useContacts } from "../../../hooks/contacts/useContacts";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useCallback } from "react";
import { router } from "expo-router";

function ContactsScreen() {
    const { contacts, isLoading } = useContacts()

    const renderNoContacts = useCallback(() => {
        if (contacts?.length) {
            return null
        }
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No contacts</Text>
            </View>
        )
    }, [contacts])

    const renderContacts = useCallback(() => {
        if (!contacts?.length) {
            return null
        }
        return (
            <View style={{ flex: 1, width: '100%', borderWidth: 1 }}>
                {contacts.map((contact) => (
                    <Pressable style={{ padding: 8, width: '100%', borderWidth: 1, margin: 2 }} key={contact.id} onPress={() => router.navigate({pathname: '/(auth)/(tabs)/transfer', params: { address: contact.address }})}>
                        <Text>{contact.name}</Text>
                        <Text>{contact.address}</Text>
                    </Pressable>
                ))}
            </View>
        )
    }, [contacts])

    if (isLoading) {
        return <ActivityIndicator />
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: 8, width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16 }}>
                <Pressable onPress={() => router.back()}>
                    <Text>Back</Text>
                </Pressable>
                <Text style={{ fontWeight: 'bold' }}>
                    Contacts
                </Text>
                <Pressable onPress={() => router.push('/(auth)/contacts/new')}>
                    <Text>New</Text>
                </Pressable>
            </View>
            <View style={{ flex: 1, width: '100%' }}>
            {renderContacts()}
            {renderNoContacts()}
            </View>
        </SafeAreaView> 
    );
}

export default ContactsScreen