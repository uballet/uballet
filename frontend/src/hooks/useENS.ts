import { useCallback } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_API_KEY } from "../env";

export const useENS = () => {
  const resolveName = useCallback(async (address: string) => {
    const alchemyApiEthMainnetUrl = "https://eth-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY;
    const sdkMainnet = new Alchemy({
      url: alchemyApiEthMainnetUrl,
      network: Network.ETH_MAINNET,
    });
    try {
      const ensResolve = await sdkMainnet.core.resolveName(address);
      return ensResolve || address;
    } catch (e) {
      console.warn("Error resolving name:", e);
      return address;
    }
  }, []);

  return { resolveName };
};
