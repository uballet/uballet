import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePasskeyRegistration } from "../../hooks/usePasskeyRegistration";
import { Redirect, router } from "expo-router";
import { useUserPasskeys } from "../../hooks/useUserPasskeys";
import { useAuthContext } from "../../providers/AuthProvider";

export default function RegisterPasskey() {
    const { register, isPending, isSuccess } = usePasskeyRegistration()
    const { skipPasskeys } = useAuthContext()

    const skipPasskeyRegistration = () => {
        skipPasskeys();
        router.navigate('/(auth)');
    }

    if (isSuccess) {
        return (
            <Redirect href={'/(auth)'} />
        )
    }
    
    return (
        <View style={styles.screenContainer}>
            <Pressable onPress={() => register()} disabled={isPending} style={styles.button}>
                <Text style={styles.buttonText}>Register passkey</Text>
            </Pressable>
            <Pressable style={styles.skipButton} onPress={skipPasskeyRegistration}>
                <Text style={styles.skipText}>Skip Passkeys</Text>
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
    },
    skipButton: {
        marginTop: 32,
        padding: 4
    },
    skipText: {
        color: 'black',
    }
})