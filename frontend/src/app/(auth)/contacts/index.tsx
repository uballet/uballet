import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useContacts } from "../../../hooks/contacts/useContacts";
import { ActivityIndicator } from "react-native-paper";
import { useCallback } from "react";
import { router } from "expo-router";

function ContactsScreen() {
    const { contacts, isLoading } = useContacts()

    const renderNoContacts = useCallback(() => {
        if (contacts?.length) {
            return null
        }
        return (
            <View className="flex-1 justify-center items-center">
                <Text>No contacts</Text>
            </View>
        )
    }, [contacts])

    const renderContacts = useCallback(() => {
        if (!contacts?.length) {
            return null
        }
        return (
            <View className="flex-1 w-full border">
                {contacts.map((contact) => (
                    <Pressable className="p-2 w-full border m-1" key={contact.id} onPress={() => router.navigate({pathname: '/(auth)/(tabs)/transfer', params: { address: contact.address }})}>
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
        <SafeAreaView className="w-full p-2 flex-1">
            <View className="w-full flex-row justify-between px-4">
                <Pressable onPress={() => router.back()}>
                    <Text>Back</Text>
                </Pressable>
                <Text className="font-bold">
                    Contacts
                </Text>
                <Pressable onPress={() => router.push('/(auth)/contacts/new')}>
                    <Text>New</Text>
                </Pressable>
            </View>
            <View className="flex-1 w-full">
            {renderContacts()}
            {renderNoContacts()}
            </View>
        </SafeAreaView> 
    );
}

export default ContactsScreen