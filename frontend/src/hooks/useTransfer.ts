import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useSafeLightAccount } from "./useLightAccount";
import { parseEther } from "viem";
import { ethers } from "ethers";

export function useTransfer() {
  const account = useSafeLightAccount();
  const { sdkClient, client } = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [txHash, setTxHash] = useState<null | string>(null);
  
  const transferToAddress = useCallback(
    async (address: `0x${string}`, etherAmount: string) => {
      try {
        setLoading(true);
        const uo = await client.sendUserOperation({
          account,
          uo: {
            target: address,
            data: "0x",
            value: parseEther(etherAmount),
          },
        });
        const txHash = await client.waitForUserOperationTransaction(uo);
        setTxHash(txHash);
      } catch (e) {
        console.error({ error: e });
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [account]
  );

  const getTokenDecimals = async (tokenContractAddress: `0x${string}`) => {
    const DEFAULT_DECIMALS = 18;
    const abi = ["function decimals() view returns (uint8)"];
    const provider = await sdkClient.config.getProvider(); 
    // @ts-ignore
    const tokenContract = new ethers.Contract(tokenContractAddress, abi, provider);

    try {
      const decimals = await tokenContract.decimals();
      console.log(decimals);
      return decimals;
    } catch (error) {
      console.error("Failed to fetch token decimals:", error);
      return DEFAULT_DECIMALS;
    }
  };

  const transferTokenToAddress = useCallback(
    async (
      tokenContractAddress: `0x${string}`,
      address: `0x${string}`,
      amount: string
    ) => {
      try {
        setLoading(true);
        
        const decimals = await getTokenDecimals(tokenContractAddress);

        const abi = ["function transfer(address to, uint256 amount)"];
        const iface = new ethers.Interface(abi);
        const data = iface.encodeFunctionData("transfer", [
          address,
          ethers.parseUnits(amount, decimals),
        ]);

        const uo = await client.sendUserOperation({
          account,
          uo: {
            target: tokenContractAddress,
            data: data as `0x${string}`,
            value: BigInt(0),
          },
        });
        const txHash = await client.waitForUserOperationTransaction(uo);
        setTxHash(txHash);
      } catch (e) {
        console.error({ error: e });
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [account, client]
  );

  return {
    transferToAddress,
    transferTokenToAddress,
    txHash,
    error,
    setError,
    loading,
  };
}
