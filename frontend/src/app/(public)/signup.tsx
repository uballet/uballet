import { View } from "react-native";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { Link } from "expo-router";
import { Button, Text, TextInput } from "react-native-paper";

export default function SignUpScreen() {
    const { signup, isPending } = useSignUp()
    const [email, setEmail] = useState<string>('');

    return (
        <View className="flex-1 justify-center items-center">
            <TextInput
                mode="outlined"
                className="w-4/5 mb-2"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoFocus={true}
            />
            <Button
                mode="contained"
                className="w-4/5 mb-2"
                disabled={isPending}
                onPress={() => signup({ email })}
            >
                <Text className="text-white">Sign up</Text>
            </Button>
            <Link style={{ alignSelf: 'center' }} href={'/(public)/login'}>
                Already have an account? Sign In!
            </Link>
            </View>
    )
}
