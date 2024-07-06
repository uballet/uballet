import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { Link } from "expo-router";

export default function SignUpScreen() {
    const { signup, isPending } = useSignUp()
    const [email, setEmail] = useState<string>('');

    return (
        <View style={styles.screenContainer}>
            <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                editable={!isPending}
            />
            <Pressable style={styles.button} disabled={isPending} onPress={() => signup({ email })}>
                <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>
            <Link href={'/(public)/login'}>
                Already have an account? Sign In!
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