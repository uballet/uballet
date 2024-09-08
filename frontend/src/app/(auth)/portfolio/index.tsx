import { SafeAreaView, ScrollView, View } from "react-native";
import PortfolioValueChart from "../../../components/PortfolioValueChart/PortfolioValueChart";
import AssetsAllocationChart from "../../../components/AssetsAllocationChart/AssetsAllocationChart";
import PnLChart from "../../../components/PnLChart/PnLChart";

function PortfolioScreen() {
  return (
    <SafeAreaView className="w-full p-4 flex-1">
      <ScrollView>
        <View>
          <View className="mb-8">
            <PortfolioValueChart />
          </View>
          <View className="mb-8">
            <AssetsAllocationChart />
          </View>
          <PnLChart />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PortfolioScreen;
