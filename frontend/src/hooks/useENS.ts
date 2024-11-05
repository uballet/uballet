import { useCallback } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_API_KEY } from "../env";
import { ethers } from "ethers";

export const useENS = () => {
  const resolveName = useCallback(async (address: string) => {
    const alchemyApiEthMainnetUrl = "https://eth-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY;
    const sdkMainnet = new Alchemy({
      url: alchemyApiEthMainnetUrl,
      network: Network.ETH_MAINNET,
    });
    try {
      const ensResolve = await sdkMainnet.core.resolveName(address);
      if (ensResolve && ethers.isAddress(ensResolve)) {
        return ensResolve;
      } else {
        return null;
      }
    } catch (e) {
      console.warn("Error resolving name:", e);
      return null;
    }
  }, []);

  return { resolveName };
};
