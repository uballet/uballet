import { Text, View } from "react-native";
import { usePasskeyRegistration } from "../../hooks/usePasskeyRegistration";
import { Redirect, router, Stack } from "expo-router";
import { useAuthContext } from "../../providers/AuthProvider";
import { ActivityIndicator } from "react-native-paper";
import { Button } from "react-native-paper";

export default function RegisterPasskey() {
    const { register, isPending, isSuccess } = usePasskeyRegistration()
    const { skipPasskeys } = useAuthContext()

    const skipPasskeyRegistration = () => {
        skipPasskeys();
        router.navigate('/(auth)');
    }

    if (isSuccess) {
        return (
            <Redirect href={'/(auth)'}/>
        )
    }

  if (isSuccess) {
    return <Redirect href={"/(auth)"} />;
  }

  const disabled = isPending;

  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Button
        mode="contained"
        onPress={() => register()}
        disabled={disabled}
        className="my-2 w-[70%]"
      >
        <Text>
          Register passkey
        </Text>
        {disabled && (
          <ActivityIndicator style={{ position: "absolute", right: 12 }} />
        )}
      </Button>
      <Button
        mode="outlined"
        disabled={disabled}
        onPress={skipPasskeyRegistration}
        className="my-8 w-[70%]"
      >
        <Text>
          Not now
        </Text>
      </Button>
    </View>
  );
}
