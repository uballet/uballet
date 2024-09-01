import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { router } from "expo-router";

const PorfolioScreen: React.FC = () => {
  return (
    <View>
      <View>
        <Text> Hola Mundo xD</Text>
      </View>
      <Button
        onPress={() => {
          router.push("balance");
        }}
      >
        <Text>Go Back</Text>
      </Button>
    </View>
  );
};

export default PorfolioScreen;
