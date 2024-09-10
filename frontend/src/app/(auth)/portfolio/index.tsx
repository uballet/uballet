import { SafeAreaView, ScrollView, View } from "react-native";
import PortfolioValueChart from "../../../components/PortfolioValueChart/PortfolioValueChart";
import AssetsAllocationChart from "../../../components/AssetsAllocationChart/AssetsAllocationChart";
import PnLChart from "../../../components/PnLChart/PnLChart";

function PortfolioScreen() {
  return (
    <SafeAreaView className="w-full p-3 flex-1">
      <ScrollView>
        <View>
          <View>
            <PortfolioValueChart />
          </View>
          <View>
            <AssetsAllocationChart />
          </View>
          <PnLChart />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PortfolioScreen;
