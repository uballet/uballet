import { Redirect } from "expo-router";
import { Text, TextInput, View, StyleSheet, Button, Pressable} from "react-native";
import { useAuthContext } from "../../providers/AuthProvider";
import { useState } from "react";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

export default function VerifyEmailScreen() {
    const { user } = useAuthContext()
    const [code, setCode] = useState<string>('')
    const { verifyEmail, isError, isSuccess, isPending } = useVerifyEmail()

    if (!user) {
        return <Redirect href={'/(public)'} />
    }

    return (
        <View style={styles.screenContainer}>
            <Text>Verify Email</Text>
            <Text>{user.email}</Text>
            <TextInput
                style={styles.textInput}
                value={code}
                onChangeText={setCode}
                placeholder="Enter verification code"
                selectTextOnFocus={false}
                editable={!isPending}
            />
            <Pressable style={styles.button} disabled={isPending} onPress={() => verifyEmail({ code })}>
                <Text style={styles.buttonText}>Send verification code</Text>
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