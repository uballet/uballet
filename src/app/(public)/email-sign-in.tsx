import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { useCompleteEmailSignIn } from "../../hooks/useCompleteEmailSignIn";
import { Button, ButtonText } from "../../components/Button";

export default function EmailSignInScreen() {
    const { complete, isPending, isError, isSuccess } = useCompleteEmailSignIn()
    const { email } = useLocalSearchParams() as { email: string }
    const [pubkeyEncrypted, setPubkeyEncrypted] = useState('')

    if (!email) {
        return <Redirect href={'/(public)/login'} />
    }

    return (
        <View style={styles.screenContainer}>
            <Text>Login: {email}</Text>
            <TextInput
                style={styles.textInput}
                value={pubkeyEncrypted}
                onChangeText={setPubkeyEncrypted}
                placeholder="Input the code sent to your email"
            />
            <Button disabled={isPending} onPress={() => complete({ email, hexCode: pubkeyEncrypted })}>
                <ButtonText>Verify Code</ButtonText>
            </Button>
        </View>
    )
}



const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: '50%',
        margin: 8,
        marginTop: 64,
        padding: 2,
        paddingHorizontal: 8,
        backgroundColor: '#EEEEEE',
        height: 32,
        borderRadius: 4
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 8,
        backgroundColor: 'black',
        width: '50%',
        padding: 8,
        alignItems: 'center',
        borderRadius: 8
    },
    buttonText: {
        color: 'white',
    }
})