import { View } from "react-native";
import { theme } from "../../styles/color";

export const Separator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: theme.colors.primary,
        marginVertical: 16,
        marginHorizontal: 8,
      }}
    />
  );