import { Text, View } from "react-native";
import { useState } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useCompleteEmailSignIn } from "../../hooks/useCompleteEmailSignIn";
import { Button, TextInput } from "react-native-paper";

export default function EmailSignInScreen() {
    const { complete, isPending, isError, isSuccess } = useCompleteEmailSignIn()
    const { email } = useLocalSearchParams() as { email: string }
    const [code, setCode ] = useState('')

    if (!email) {
        return <Redirect href={'/(public)/login'} />
    }

    console.log({ complete, isPending })

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="m-4">Login: {email}</Text>
            <TextInput
                className="w-2/3"
                mode="outlined"
                value={code}
                onChangeText={setCode}
                textContentType="oneTimeCode"
                keyboardType="number-pad"
                placeholder="Input Code"
            />
            <Button className="m-4" mode="contained" disabled={isPending} onPress={() => complete({ email, code })}>
                <Text>Submit Code</Text>
            </Button>
        </View>
    )
}