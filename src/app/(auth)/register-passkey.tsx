import { StyleSheet, View } from "react-native";
import { usePasskeyRegistration } from "../../hooks/usePasskeyRegistration";
import { Redirect, router } from "expo-router";
import { useAuthContext } from "../../providers/AuthProvider";
import { ActivityIndicator } from "react-native-paper";
import { Button, ButtonText } from "../../components/Button";

export default function RegisterPasskey() {
    const { register, isPending, isSuccess, isSupported } = usePasskeyRegistration()
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

    if (!isSupported) {
        skipPasskeyRegistration();
    }

    const disabled = isPending
    
    return (
        <View style={styles.screenContainer}>
            <Button
                onPress={() => register()}
                disabled={disabled}
                variant="primary"
                style={[styles.button]}
            >
                <ButtonText disabled={disabled} variant="primary">Register passkey</ButtonText>
                {disabled && <ActivityIndicator style={{ position: 'absolute', right: 12 }} />}
            </Button>
            <Button
                variant="inverse"
                disabled={disabled}
                onPress={skipPasskeyRegistration}
                style={[styles.button]}
            >
                <ButtonText variant="inverse" disabled={disabled}>Not now</ButtonText>
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
    button: {
        marginVertical: 8,
        width: '70%',
    }
})