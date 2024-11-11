import { SafeAreaView, ScrollView, View } from "react-native";
import PortfolioValueChart from "../../../components/PortfolioValueChart/PortfolioValueChart";
import AssetsAllocationChart from "../../../components/AssetsAllocationChart/AssetsAllocationChart";
import PnLChart from "../../../components/PnLChart/PnLChart";
import { Card } from "react-native-paper";

function PortfolioScreen() {
  return (
    <View
      style={{
        flex: 0,
        padding: 12,
        width: "100%",
        height: "100%",
      }}
    >
      <AssetsAllocationChart />
    </View>
  );
}

export default PortfolioScreen;
