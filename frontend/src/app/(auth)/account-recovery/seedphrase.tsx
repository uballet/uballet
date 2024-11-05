import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { useSeedPhraseRecovery } from "../../../hooks/useSeedPhraseRecovery";
import { Redirect } from "expo-router";
import { useLogout } from "../../../hooks/useLogout";


function ErrorText({ isError }: { isError: boolean }) {
    if (!isError) {
        return null
    }
    return (
        <Text className="text-red-700 m-2">
            Invalid seed phrase
        </Text>
    )
}
export default function SeedPhraseRecoveryScreen() {
    const [seedPhrase, setSeedphrase] = useState('')
    const { recover, isPending, isSuccess, isError } = useSeedPhraseRecovery()
    const logout = useLogout()
    const onButtonPress = () => {
        recover({ code: seedPhrase })
    }

    if (isSuccess) {
        return <Redirect href={'/(auth)/'} />
    }
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="m-2">Recover with seedphrase</Text>
            <TextInput
                multiline={true}
                numberOfLines={5}
                returnKeyType="done"
                blurOnSubmit
                mode="outlined"
                className="w-3/4 h-40"
                value={seedPhrase}
                placeholder="Enter seed phrase"
                onChangeText={setSeedphrase}
                autoCapitalize="none"
            />
            <ErrorText isError={isError} />
            <Button disabled={isPending} onPress={onButtonPress} mode="contained" className="m-2">
                <Text>Recover</Text>
            </Button>
            <Button testID="logout-button" mode="outlined" className="m-4 w-2/3" onPress={logout}>
                <Text className="text-red-700">Log Out</Text>
            </Button>
        </View>
    );
}