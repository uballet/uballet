import { Redirect } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { ActivityIndicator, TextInput } from 'react-native-paper'
import { useAuthContext } from "../../providers/AuthProvider";
import { useState } from "react";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";
import { Button, ButtonText } from "../../components/Button";

export default function VerifyEmailScreen() {
    const { user } = useAuthContext()
    const [code, setCode] = useState<string>('')
    const { verifyEmail, isPending, isSuccess } = useVerifyEmail()
    const isLoading = isPending || isSuccess
    const disabled = isLoading || !code

    if (!user) {
        return <Redirect href={'/(public)'} />
    }

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.text}>Verify your email: {user.email}</Text>
            <TextInput
                style={styles.textInput}
                value={code}
                mode="outlined"
                onChangeText={setCode}
                textContentType="oneTimeCode"
                keyboardType="number-pad"
                placeholder="Enter verification code"
                selectTextOnFocus={false}
                editable={!isPending}
            />
            <Button style={styles.button} disabled={disabled} onPress={() => verifyEmail({ code })}>
                <ButtonText disabled={disabled}>Send verification code</ButtonText>
                {isLoading && <ActivityIndicator />}
            </Button>
        </View>
    )
}



const styles = StyleSheet.create({
    text: {
        margin: 8,
        fontSize: 16
    },
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: '70%',
        margin: 8,
    },
    button: {
        marginVertical: 8,
        width: '70%',
    },
    buttonText: {
        color: 'white',
    }
})