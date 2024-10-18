import React from "react";
import { ActivityIndicator, Button } from "react-native-paper";
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
    <Button testID="transfer-button"
      mode="contained"
      style={[styles.button, { width: 200 }]}
      onPress={currency === ethSymbol ? onTransferETH : onTransferToken}
      disabled={loading}
    >
      { loading ? 
        <ActivityIndicator testID="transfer-button-activity-indicator"/> 
        : "Transfer!" }
    </Button>
  );
};

export default TransferButton;
