import { Text, View } from "react-native";
import { usePasskeyRegistration } from "../../hooks/usePasskeyRegistration";
import { Redirect, router, Stack } from "expo-router";
import { useAuthContext } from "../../providers/AuthProvider";
import { ActivityIndicator } from "react-native-paper";
import { Button } from "react-native-paper";
import style from "../../styles/styles";

export default function RegisterPasskey() {
  const { register, isPending, isSuccess } = usePasskeyRegistration();
  const { skipPasskeys } = useAuthContext();

  const skipPasskeyRegistration = () => {
    skipPasskeys();
    router.navigate("/(auth)");
  };

  if (isSuccess) {
    return <Redirect href={"/(auth)"} />;
  }

  if (isSuccess) {
    return <Redirect href={"/(auth)"} />;
  }

  const disabled = isPending;

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Button
        mode="contained"
        onPress={() => register()}
        style={style.button}
        disabled={disabled}
        className="my-1"
      >
        <Text className="font-bold">Register passkey</Text>
        {disabled && (
          <ActivityIndicator style={{ position: "absolute", right: 12 }} />
        )}
      </Button>
      <Button
        mode="outlined"
        style={style.button}
        disabled={disabled}
        onPress={skipPasskeyRegistration}
        className="my-1"
      >
        <Text className=" text-red-700 font-bold">Not now</Text>
      </Button>
    </View>
  );
}
