import { KeyboardAvoidingView, SafeAreaView, ScrollView, TextInput as RNTextInput, View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { useSeedPhraseRecovery } from "../../../hooks/useSeedPhraseRecovery";
import { Redirect, useRouter } from "expo-router";
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
    const { recover, isPending, isSuccess, isError } = useSeedPhraseRecovery()
    React.createRef()
    const [mnemonic, setMnemonic] = useState(new Array(12).fill(''))
    const [refs, setRefs] = useState<React.RefObject<RNTextInput>[]>(new Array(12).fill(null))
    const router = useRouter();

    useEffect(() => {
        setRefs(refs => refs.map((ref, index) => {
            return React.createRef()
        }))
    }, [])

    function onSetMnemonic(mnemonicWord: string, index: number) {
        const newMnemonic = [...mnemonic]
        newMnemonic[index] = mnemonicWord.trim()
        setMnemonic(newMnemonic)
    }
    const onButtonPress = () => {
        recover({ code: mnemonic.join(' ') })
    }

    if (isSuccess) {
        return <Redirect href={'/(auth)/'} />
    }

    return (
        <SafeAreaView className="flex-1 mt-16">
            <Text className="m-2 self-center" variant="titleLarge">Recover with seedphrase</Text>
            <View className="flex-row">
                <View className="w-1/2">
                    {mnemonic.slice(0, 6).map((word, index) => (
                        <View key={`word-${index}`} className="flex-row items-center m-2">
                            <Text>Word: {index + 1}</Text>
                            <TextInput
                                testID={`seed-phrase-input-${index}`}
                                returnKeyType="next"
                                key={`word-${index}`}
                                blurOnSubmit
                                ref={refs[index]}
                                mode="outlined"
                                className="flex-1 mx-2"
                                autoComplete="off"
                                onSubmitEditing={() => {
                                    console.log({ ref: refs[index + 1] })
                                    console.log({ index})
                                    refs[index + 1]?.current?.focus()
                                }}
                                autoCorrect={false}
                                value={word}
                                placeholder={"Word " + (index + 1)}
                                onChangeText={(v) => onSetMnemonic(v, index)}
                                autoCapitalize="none"
                            />
                        </View>
                    ))}
                </View>
                <View className="w-1/2">
                    {mnemonic.slice(6, 12).map((word, index) => (
                        <View key={`word-${index + 6}`} className="flex-row items-center m-2">
                            <Text>Word: {index + 7}</Text>
                            <TextInput
                                testID={`seed-phrase-input-${index + 6}`}
                                key={`word-${index + 6}`}
                                returnKeyType="next"
                                blurOnSubmit
                                ref={refs[index + 6]}
                                mode="outlined"
                                onSubmitEditing={() => refs[index + 7]?.current?.focus?.()}
                                className="flex-1 mx-2"
                                autoComplete="off"
                                autoCorrect={false}
                                value={word}
                                placeholder={"Word " + (index + 7)}
                                onChangeText={(v) => onSetMnemonic(v, index + 6)}
                                autoCapitalize="none"
                            />
                        </View>
                    ))}
                </View>
            </View>
            <View>
                <ErrorText isError={isError} />
                <Button disabled={isPending || mnemonic.some(word => !word)} onPress={onButtonPress} mode="contained" className="m-2 w-2/3 self-center">
                    Recover
                </Button>
                <Button testID="logout-button" mode="outlined" className="m-4 w-2/3 self-center" onPress={router.canGoBack() ? router.back : () => router.replace('/(auth)/')}>
                    <Text className="text-red-700">Back</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}