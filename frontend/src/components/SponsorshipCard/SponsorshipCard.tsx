import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Card, Text } from "react-native-paper"

interface SponsorshipCardProps {
  loadingSponsorship: boolean;
  isSponsored: boolean;
}

const SponsorshipCard: React.FC<SponsorshipCardProps> = ({ loadingSponsorship, isSponsored }) => {
  return (
    <Card style={{ 
      margin: 8, 
      padding: 16, 
      alignItems: 'center',
      backgroundColor: loadingSponsorship ? 'white' : isSponsored ? 'green' : 'red'
    }}>
      {loadingSponsorship ? (
        <ActivityIndicator size="large" color="white" testID="sponsorship-loading" />
      ) : (
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
          {isSponsored ? "We'll pay for gas!" : "You'll pay for gas"}
        </Text>
      )}
    </Card>
  );
};

export default SponsorshipCard;

