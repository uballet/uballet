import React from "react";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import styles from "../../styles/styles";

interface TransferButtonProps {
  currency: string;
  ethSymbol: string;
  loading: boolean;
  onTransferETH: () => void;
  onTransferToken: () => void;
}

const TransferButton: React.FC<TransferButtonProps> = ({
  currency,
  ethSymbol,
  loading,
  onTransferETH,
  onTransferToken,
}) => {
  return (
    <Button
      testID="transfer-button"
      mode="contained"
      style={styles.button}
      onPress={currency === ethSymbol ? onTransferETH : onTransferToken}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator testID="transfer-button-activity-indicator" />
      ) : (
        <Text className="text-white text-center font-bold"> Transfer!</Text>
      )}
    </Button>
  );
};

export default TransferButton;
