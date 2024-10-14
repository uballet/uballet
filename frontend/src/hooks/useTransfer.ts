import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useSafeLightAccount } from "./useLightAccount";
import { parseEther } from "viem";
import { ethers } from "ethers";

export function useTransfer() {
  const account = useSafeLightAccount();
  const { sdkClient, client } = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);  // Store error message instead of just a boolean
  const [txHash, setTxHash] = useState<null | string>(null);
  
  const transferToAddress = useCallback(
    async (address: `0x${string}`, etherAmount: string) => {
      setLoading(true);
      setError(null);
      try {
        let uo;
        try {
          uo = await client.sendUserOperation({
            account,
            uo: {
              target: address,
              data: "0x",
              value: parseEther(etherAmount),
            },
          });
        } catch (e) {
          console.error("Error during client.sendUserOperation:", e);
          setError("Error during client.sendUserOperation");
          return;
        }

        try {
          const txHash = await client.waitForUserOperationTransaction(uo);
          setTxHash(txHash);
        } catch (e) {
          setError("waitForUserOperationTransaction");
        }
      } catch (e) {
        console.error({ error: e });
        setError("Unexpected error during transfer");
      } finally {
        setLoading(false);
      }
    },
    [account, client]
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
      setLoading(true);
      setError(null);  // Clear previous error
      try {
        let decimals;
        try {
          decimals = await getTokenDecimals(tokenContractAddress);
        } catch (e) {
          console.error("Error fetching token decimals:", e);
          setError("Error fetching token decimals");
          return;
        }

        const abi = ["function transfer(address to, uint256 amount)"];
        const iface = new ethers.Interface(abi);
        const data = iface.encodeFunctionData("transfer", [
          address,
          ethers.parseUnits(amount, decimals),
        ]);

        let uo;
        try {
          uo = await client.sendUserOperation({
            account,
            uo: {
              target: tokenContractAddress,
              data: data as `0x${string}`,
              value: BigInt(0),
            },
          });
        } catch (e) {
          console.error("Error during client.sendUserOperation:", e);
          setError("sendUserOperation");
          return;
        }

        try {
          const txHash = await client.waitForUserOperationTransaction(uo);
          setTxHash(txHash);
        } catch (e) {
          setError("waitForUserOperationTransaction");
        }
      } catch (e) {
        console.error({ error: e });
        setError("Unexpected error during token transfer");
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
    error,  // Return the detailed error message
    setError,
    loading,
  };
}
