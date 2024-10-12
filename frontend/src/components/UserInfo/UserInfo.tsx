import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, IconButton } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

interface UserInfoProps {
  email: string;
  contractDeployed: boolean;
  publicAddress: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ email, contractDeployed, publicAddress }) => {
  const shortenedAddress = `${publicAddress.slice(0, 6)}...${publicAddress.slice(-4)}`;

  const handleCopyToClipboard = () => {
    Clipboard.setStringAsync(publicAddress);
  };

  return (
    <View style={userStyles.container}>
      <View style={userStyles.leftContainer}>
        <Avatar.Icon testID="user-icon"
          style={[
            userStyles.icon,
            { backgroundColor: contractDeployed ? "green" : "gray" },
          ]}
          size={30}
          icon="account"
          color="white"
        />
        <Text style={userStyles.emailText} variant="titleMedium">{email}</Text>
      </View>
      <View style={userStyles.addressContainer}>
        <Text>{shortenedAddress}</Text>
        <IconButton
          icon="content-copy"
          size={20}
          onPress={handleCopyToClipboard}
          accessibilityLabel="Copy address"
        />
      </View>
    </View>
  );
};

const userStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 0,
  },
  emailText: {
    marginLeft: 10,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default UserInfo;
