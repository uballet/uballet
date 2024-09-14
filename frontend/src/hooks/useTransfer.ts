import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { parseEther } from "viem";
import { ethers } from "ethers";

export function useTransfer() {
  const { account } = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [txHash, setTxHash] = useState<null | string>(null);
  const transferToAddress = useCallback(
    async (address: `0x${string}`, etherAmount: string) => {
      try {
        setLoading(true);
        // const uo = await account!.sendUserOperation({
        //   uo: {
        //     target: address,
        //     data: "0x",
        //     value: parseEther(etherAmount),
        //   },
        //   context: {
        //     aggregatedSignature: "0x",
        //     signatures: [],
        //   },
        // });
        // const txHash = await account!.waitForUserOperationTransaction(uo);
        // setTxHash(txHash);
      } catch (e) {
        console.error({ error: e });
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [account]
  );

  const transferTokenToAddress = useCallback(
    async (
      tokenContractAddress: `0x${string}`,
      address: `0x${string}`,
      amount: string
    ) => {
      try {
        setLoading(true);

        const abi = ["function transfer(address to, uint256 amount)"];
        const iface = new ethers.Interface(abi);
        const data = iface.encodeFunctionData("transfer", [
          address,
          ethers.parseUnits(amount, 18),
        ]);

        // const uo = await account.sendUserOperation({
        //   account,
        //   uo: {
        //     target: tokenContractAddress,
        //     data: data as `0x${string}`,
        //     value: BigInt(0),
        //   },
        // });
        // const txHash = await account.waitForUserOperationTransaction(uo);
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

  return {
    transferToAddress,
    transferTokenToAddress,
    txHash,
    error,
    setError,
    loading,
  };
}
