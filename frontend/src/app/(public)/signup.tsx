import { View } from "react-native";
import { useSignUp } from "../../hooks/useSignUp";
import { useState } from "react";
import { Link } from "expo-router";
import { Button, Text, TextInput } from "react-native-paper";

export default function SignUpScreen() {
    const { signup, isPending, isError } = useSignUp()
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
            {isError && <Text className="text-red-500 mb-4">Invalid email / Already signed up</Text>}
            <Button
                mode="contained"
                className="w-4/5 mb-2"
                disabled={isPending}
                onPress={() => signup({ email })}
            >
                <Text className="text-white">Sign up</Text>
            </Button>
            <Link href={'/(public)/login'}>
                <Text className="text-blue-500">Already have an account? Sign In!</Text>
            </Link>
            </View>
    )
}
