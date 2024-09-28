import { Redirect } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Button, TextInput } from 'react-native-paper'
import { useAuthContext } from "../../providers/AuthProvider";
import { useState } from "react";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

export default function VerifyEmailScreen() {
    const { user } = useAuthContext()
    const [code, setCode] = useState<string>('')
    const { verifyEmail, isPending, isSuccess, isError } = useVerifyEmail()
    const isLoading = isPending || isSuccess
    const disabled = isLoading || !code

    if (!user) {
        return <Redirect href={'/(public)'} />
    }

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="m-4">Verify your email: {user.email}</Text>
            <TextInput
                value={code}
                className="w-2/3"
                mode="outlined"
                onChangeText={setCode}
                textContentType="oneTimeCode"
                keyboardType="number-pad"
                placeholder="Enter verification code"
                selectTextOnFocus={false}
                editable={!isPending}
            />
            {isError && <Text className="text-red-500 mt-2">Invalid code. Check your email.</Text>}
            <Button mode="contained" className="m-8 w-2/3" disabled={disabled} loading={isLoading} onPress={() => verifyEmail({ code })}>
                <Text>Submit Code</Text>
            </Button>
        </View>
    )
}
