import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Slot, Stack } from "expo-router";

function TransferScreenLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Transfer",
          headerStyle: { backgroundColor: "#277ca5" },
          headerShown: true,
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <View style={{ flex: 1 }}>
        <Slot /> 
      </View>
    </SafeAreaView>
  );
}

export default TransferScreenLayout;
