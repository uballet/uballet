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
        margin: 0,
        padding: 8,
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
          variant="labelLarge"
          style={{
            fontSize: 16,
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
