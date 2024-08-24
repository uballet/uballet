import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { useSeedPhraseRecovery } from "../../../hooks/useSeedPhraseRecovery";
import { Redirect } from "expo-router";


function ErrorText({ isError }: { isError: boolean }) {
    if (!isError) {
        return null
    }
    return (
        <Text style={{ color: "red", margin: 8 }}>
            Invalid seed phrase
        </Text>
    )
}
export default function SeedPhraseRecoveryScreen() {
    const [seedPhrase, setSeedphrase] = useState('')
    const { recover, isPending, isSuccess, isError } = useSeedPhraseRecovery()
    const onButtonPress = () => {
        recover({ code: seedPhrase })
    }

    if (isSuccess) {
        return <Redirect href={'/(auth)/'} />
    }
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ margin: 4 }}>Recover with seedphrase</Text>
            <TextInput
                multiline={true}
                numberOfLines={5}
                mode="outlined"
                style={{ width: "70%", height: 200, margin: 8 }}
                value={seedPhrase}
                placeholder="Enter seed phrase"
                onChangeText={setSeedphrase}
                autoCapitalize="none"
            />
            <ErrorText isError={isError} />
            <Button disabled={isPending} onPress={onButtonPress} style={{ width: "70%" }}>
                <Text>Recover</Text>
            </Button>
        </View>
    );
}