import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePasskeyRegistration } from "../../hooks/usePasskeyRegistration";
import { Redirect, router } from "expo-router";
import { useAuthContext } from "../../providers/AuthProvider";
import { ActivityIndicator } from "react-native-paper";
import { theme } from "../../styles/color";

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

    const disabled = isPending
    
    return (
        <View style={styles.screenContainer}>
            <Pressable onPress={() => register()} disabled={disabled} style={{
                ...styles.button,
                ...(disabled ? styles.buttonDisabled : {}),
            }}>
                <Text style={disabled ? styles.textDisabled : styles.buttonText}>Register passkey</Text>
                {disabled && <ActivityIndicator style={{ position: 'absolute', right: 12 }} />}
            </Pressable>
            <Pressable
                style={{
                    ...styles.skipButton,
                    ...(disabled ? styles.buttonDisabled : {}),
                }}
                onPress={skipPasskeyRegistration}
            >
                <Text style={disabled ? styles.textDisabled : styles.skipText}>Skip Passkeys</Text>
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
    button: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 8,
        backgroundColor: theme.colors.primaryContainer,
        width: '50%',
        padding: 8,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8
    },
    buttonText: {
        color: theme.colors.onPrimary,
    },
    skipButton: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        width: '50%',
        marginTop: 32,
        padding: 8,
        paddingVertical: 12,
        borderRadius: 8
    },
    buttonDisabled: {
        backgroundColor: theme.colors.surfaceDisabled,
        borderWidth: 0
    },
    skipText: {
        color: theme.colors.primary,
    },
    textDisabled: {
        color: theme.colors.onSurfaceDisabled
    }
})