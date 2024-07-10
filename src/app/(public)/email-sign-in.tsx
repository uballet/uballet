import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { useCompleteEmailSignIn } from "../../hooks/useCompleteEmailSignIn";

export default function EmailSignInScreen() {
    const { complete, isPending, isError, isSuccess } = useCompleteEmailSignIn()
    const { email } = useLocalSearchParams() as { email: string }
    const [pubkeyEncrypted, setPubkeyEncrypted] = useState('03684e9b3f3284b8f48a9832ede36bb2b9a9f14d57ade949bad9ce66c437c5860aa3ed5345092ec66e0465c9e2c45af21d996a66dd4ebbcd28')

    if (!email) {
        return <Redirect href={'/(public)/login'} />
    }

    // return (
    //     <Redirect href={'/(public)/login'} />
    // )

    return (
        <View style={styles.screenContainer}>
            <TextInput
                style={styles.textInput}
                value={email}
                editable={false}
            />
            <TextInput
                style={styles.textInput}
                value={pubkeyEncrypted}
                onChangeText={setPubkeyEncrypted}
                placeholder="Input the code sent to your email"
            />
            <Pressable style={styles.button} disabled={isPending} onPress={() => complete({ email, hexCode: pubkeyEncrypted })}>
                <Text style={styles.buttonText}>Verify Code</Text>
            </Pressable>
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