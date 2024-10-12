import React from "react";
import { View, } from "react-native";
import { Text } from "react-native-paper";
import { Avatar } from "react-native-paper";
import styles from "../../styles/styles";

interface UserInfoProps {
  email: string;
  contractDeployed: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ email, contractDeployed }) => {
  return (
    <View style={styles.horizontalContainer}>
      <Avatar.Icon testID="user-icon"
        style={[
          styles.userSettings,
          {
            backgroundColor: contractDeployed ? "green" : "gray",
          },
        ]}
        size={30}
        icon="account"
        color="white"
      />
      <Text style={{ flex: 1, left: 50 }} variant="titleLarge">
        {email}
      </Text>
    </View>
  );
};

export default UserInfo;
