import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAddContact } from "../../../hooks/contacts/useAddContact";
import { router } from "expo-router";

function NewContactScreen() {
    const [name, setName] = useState('')
    const [address, setAddress] = useState<`0x${string}`>('0x')
    const { addNewContact, isSuccess } = useAddContact()

    const updateAddress = useCallback((address: `${string}`) => {
        if (address.startsWith('0x') || address.startsWith('0X')) {
            setAddress(`0x${address.slice(2)}`)
        }
    }, [])

    const onPress = useCallback(() => {
        addNewContact({ name, address })
    }, [addNewContact, name, address])

    useEffect(() => {
        if (isSuccess) {
            router.back();
        }
    }, [isSuccess])

    return (
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={{ margin: 8, width: '80%' }}
            />
            <TextInput
                label="Address"
                value={address}
                onChangeText={updateAddress}
                style={{ margin: 16, width: '80%' }}
            />
            <Button disabled={!name || !address} mode="contained" onPress={onPress}>
                <Text>
                    Add Contact
                </Text>
            </Button>
        </View>
    )
}

export default NewContactScreen
