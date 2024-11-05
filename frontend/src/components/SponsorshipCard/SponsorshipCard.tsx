import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "react-native-paper";
import { theme } from "../../styles/color";

interface SponsorshipCardProps {
  loadingSponsorship: boolean;
  isSponsored: boolean;
}

const SponsorshipCard: React.FC<SponsorshipCardProps> = ({
  loadingSponsorship,
  isSponsored,
}) => {
  return (
    <View
      style={{
        margin: 8,
        padding: 16,
        alignItems: "center",
      }}
    >
      {loadingSponsorship ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          testID="sponsorship-loading"
        />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: isSponsored ? "green" : "red",
          }}
        >
          {isSponsored ? "We'll pay for gas!" : "You'll pay for gas"}
        </Text>
      )}
    </View>
  );
};

export default SponsorshipCard;
