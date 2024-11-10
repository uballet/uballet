import { View } from "react-native";
import { theme } from "../../styles/color";

export const Separator = () => (
  <View
    style={{
      height: 0.5,
      backgroundColor: theme.colors.primary,
      marginVertical: 16,
      marginHorizontal: 4,
    }}
  />
);
