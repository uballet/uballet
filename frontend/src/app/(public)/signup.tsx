import { View, StyleSheet } from "react-native";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { Link } from "expo-router";
import { TextInput } from "react-native-paper";
import { Button, ButtonText } from "../../components/Button";
import styles from "../../styles/styles";

export default function SignUpScreen() {
    const { signup, isPending } = useSignUp()
    const [email, setEmail] = useState<string>('');


    return (
        <View style={[styles.containerLogin, screenStyles.container]}>
            <TextInput
                mode="outlined"
                style={[styles.item, screenStyles.input]}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoFocus={true}
            />
            <Button
                style={screenStyles.button}
                disabled={isPending}
                onPress={() => signup({ email })}
            >
                <ButtonText variant="primary">Sign up</ButtonText>
            </Button>
            <Link style={{ alignSelf: 'center' }} href={'/(public)/login'}>
                Already have an account? Sign In!
            </Link>
            </View>
    )
}

const screenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 8,
        padding: 2,
        width: '90%',
        alignSelf: 'center'
    },
    button: {
        width: '90%',
        alignSelf: 'center',
        marginVertical: 8
    }
})