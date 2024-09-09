import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import styles from "../../../styles/styles";
import { useSafeLightAccount } from "../../../hooks/useLightAccount";

const DepositScreen = () => {
  const account = useSafeLightAccount();
  const address = account?.address;

  // Function to copy the account address
  const copyToClipboard = () => {
    console.log("Copied to clipboard");
  };

  // For the QR code

  // npm install react-native-qrcode-svg

  // import QRCode from "react-native-qrcode-svg";

  //  <View className="flex items-center justify-center mb-4">
  //    <QRCode
  //      value={accountDirection}
  //      size={150} // Adjust the size of the QR code
  //    />
  //  </View>

  return (
    <SafeAreaView className="w-full flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-gray-100 p-6">
          <Text className="text-lg font-semibold mb-4 text-black p-1">
            For deposit, send your tokens to the following account direction:
          </Text>
          <View className="bg-gray-200 p-3 rounded-lg mb-1">
            <Text className="text-black text-sm">{address}</Text>
          </View>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "black" }}
            onPress={copyToClipboard}
            className="p-3 rounded-md"
          >
            <Text className="text-white text-center font-medium">
              Copy to Clipboard
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DepositScreen;
