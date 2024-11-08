import { Ionicons } from "@expo/vector-icons";
import { Slot, Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native";

function ImportLayout() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
      <Stack.Screen
        options={{
          title: "Import Tokens",
          headerStyle: { backgroundColor: "#277ca5" },
          headerShown: true,
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Slot />
    </SafeAreaView>
  );
}

export default ImportLayout;
