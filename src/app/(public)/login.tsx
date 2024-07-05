import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useEmailSignIn from "../../hooks/useEmailSignIn";
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { usePasskeySignIn } from "../../hooks/usePasskeySignIn";

export default function LogInScreen() {
    const [email, setEmail] = useState<string>('');

    const { login, isPending: isEmailPending } = useEmailSignIn()
    const { signIn: loginWithPasskey, isPending: isPendingPasskey } = usePasskeySignIn()

    const isLoading = isEmailPending || isPendingPasskey

    return (
        <View style={styles.screenContainer}>
            <Text>Sign in</Text>
            <Pressable onPress={() => loginWithPasskey()} style={styles.button} disabled={isLoading}>
                <Text style={styles.buttonText}>Sign in with passkey</Text>
                <MaterialIcons name="key" size={24} color="white" />
            </Pressable>
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <Pressable style={styles.button} disabled={isLoading} onPress={() => login({ email })}>
                <Text style={styles.buttonText}>Sign in with email</Text>
            </Pressable>
            <Link href={'/(public)/signup'}>
                <Text>Don't have an account? Sign Up!</Text>
            </Link>
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