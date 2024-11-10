import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import styles from "../../../styles/styles";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { useAccountContext } from "../../../hooks/useAccountContext";
import { Button } from "react-native-paper";
import { theme } from "../../../styles/color";

const DepositScreen = () => {
  const { lightAccount, initiator } = useAccountContext();
  const account = initiator || lightAccount;
  const address = account!.getAddress();

  // Function to copy the account address
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address);
    console.log("Copied to clipboard:", address);
  };

  return (
    <SafeAreaView className="w-full flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-gray-100 p-6">
          <Text className="text-lg font-semibold mb-4 text-black p-1">
            For deposit, send your tokens to the following account direction:
          </Text>

          <View className="flex items-center justify-center mb-5">
            <QRCode
              value={address}
              size={150} // Adjust the size of the QR code
            />
          </View>

          <View className="bg-gray-200 p-4 rounded-lg">
            <Text className="text-black text-sm">{address}</Text>
          </View>
          <Button
            style={{ ...styles.button, backgroundColor: theme.colors.primary }}
            onPress={copyToClipboard}
          >
            <Text className="text-white text-center font-bold">
              Copy to Clipboard
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DepositScreen;
