import { View } from "react-native";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { Link } from "expo-router";
import { Button, Text, TextInput } from "react-native-paper";

export default function SignUpScreen() {
    const { signup, isPending, isError, error } = useSignUp()
    const [email, setEmail] = useState<string>('');

    const errorMessage = error instanceof Error 
        ? error.message 
        : 'Invalid email / Already signed up'

    const handleSignUp = async () => {
        try {
            await signup({ email })
        } catch (err) {
            // Error is already handled by the mutation
            // and displayed through the error state
        }
    }

    return (
        <View className="flex-1 justify-center items-center">
            <TextInput
                testID="sign-up-email-input"
                mode="outlined"
                className="w-4/5 mb-2"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoFocus={true}
            />
            {isError && <Text className="text-red-500 mb-4">{errorMessage}</Text>}
            <Button
                testID="sign-up-button"
                mode="contained"
                className="w-4/5 mb-2"
                disabled={isPending}
                onPress={handleSignUp}
            >
                <Text className="text-white">Sign up</Text>
            </Button>
            <Link href={'/(public)/login'}>
                <Text testID="already-signed-up-link" className="text-blue-500">Already have an account? Sign In!</Text>
            </Link>
            </View>
    )
}
