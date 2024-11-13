import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface UballetSpinnerProps {}

const UballetSpinner: React.FC<UballetSpinnerProps> = ({}) => {
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
};

export default UballetSpinner;
