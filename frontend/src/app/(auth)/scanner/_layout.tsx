import { Slot, Stack } from "expo-router";
import { SafeAreaView } from "react-native";

function ScannerLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Stack.Screen
        options={{
          title: "Scan QR adress",
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

export default ScannerLayout;
