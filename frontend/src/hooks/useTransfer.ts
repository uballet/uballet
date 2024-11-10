import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { parseEther, parseUnits, toHex } from "viem";
import { ethers } from "ethers";
import { useUsdcContractAddress } from "../providers/UsdcContractProvider";
import { SendUserOperationResult, UserOperationCallData } from "@aa-sdk/core";

interface TransferParams {
  address: `0x${string}`;
  amount: string;
  tokenAddress?: `0x${string}`;
  gasInUsdc?: string;
}

export function useTransfer() {
  // @ts-ignore
  const { lightAccount, erc20LightAccount, initiator, erc20Initiator, submitter, erc20Submitter } = useAccountContext();
  const { sdkClient } = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);  // Store error message instead of just a boolean
  const [txHash, setTxHash] = useState<null | string>(null);
  const usdcAddress = useUsdcContractAddress()

  const getTokenDecimals = async (tokenContractAddress: `0x${string}`) => {
    const DEFAULT_DECIMALS = 18;
    const abi = ["function decimals() view returns (uint8)"];
    const provider = await sdkClient!.config.getProvider();
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

  const getUserOperationCallData = useCallback(async ({ address, amount, tokenAddress, gasInUsdc }: TransferParams) => {
    let transferUoCallData: UserOperationCallData
    let usdcGasCallData: UserOperationCallData | null = null
    if (tokenAddress) {
      const decimals = await getTokenDecimals(tokenAddress as `0x${string}`)
      const abi = ["function transfer(address to, uint256 amount)"];
      const iface = new ethers.Interface(abi);
      const data = iface.encodeFunctionData("transfer", [
        address,
        ethers.parseUnits(amount, decimals),
      ]);
      transferUoCallData = {
        target: tokenAddress as `0x${string}`,
        data: data as `0x${string}`,
        value: 0n
      }
    } else {
      transferUoCallData = {
        target: address,
        data: "0x",
        value: parseEther(amount),
      };
    }

    if (gasInUsdc) {
      const abi = ["function approve(address,uint)"];
      const iface = new ethers.Interface(abi);
      const tokenApprovalData = iface.encodeFunctionData("approve", [
        "0x00000000000000fb866daaa79352cc568a005d96",
        parseUnits(gasInUsdc ?? "1", 6)
      ]);

      usdcGasCallData = {
        target: usdcAddress as `0x${string}`,
        data: tokenApprovalData as `0x${string}`,
        value: 0n
      }
    }

    return { transferUoCallData, usdcGasCallData }
  }, [usdcAddress])

  const transfer = useCallback(async ({ address, amount, tokenAddress, gasInUsdc }: TransferParams) => {
    setLoading(true);
    setError(null);

    try {
      const { transferUoCallData, usdcGasCallData } = await getUserOperationCallData({ address, amount, tokenAddress, gasInUsdc })
      let uo: SendUserOperationResult
      if (lightAccount) {
        const account = usdcGasCallData ? erc20LightAccount : lightAccount
        try {
          uo = await account.sendUserOperation({
            uo: usdcGasCallData ? [usdcGasCallData, transferUoCallData] : transferUoCallData,
            overrides: {
              preVerificationGas: { multiplier: 3 },
            }
          });
        } catch (error) {
          console.error("Error sending user operation:", error);
          setLoading(false);
          setError("Error sending user operation");
          return;
        }

        try {
          const txHash = await account.waitForUserOperationTransaction(uo);
          setTxHash(txHash);
        } catch (error) {
          console.error("Error waiting for transaction:", error);
          setLoading(false);
          setError("waitForUserOperationTransaction");
          return;
        }
      } else if (initiator && submitter) {
        const initiatorAccount = usdcGasCallData ? erc20Initiator : initiator
        const submitterAccount = usdcGasCallData ? erc20Submitter : submitter

        try {
          const { signatureObj: signature1, aggregatedSignature, request } = await initiatorAccount!.proposeUserOperation({
            uo: usdcGasCallData ? [usdcGasCallData, transferUoCallData] : transferUoCallData,
            overrides: {
              preVerificationGas: { multiplier: 3 },
            }
          })
          uo = await submitterAccount.sendUserOperation({
            uo: request.callData,
            context: {
              signatures: [signature1],
              aggregatedSignature,
              userOpSignatureType: 'UPPERLIMIT',
            },
            overrides: {
              preVerificationGas: request.preVerificationGas,
              callGasLimit: request.callGasLimit,
              verificationGasLimit: request.verificationGasLimit,
              maxFeePerGas: request.maxFeePerGas,
              maxPriorityFeePerGas: request.maxPriorityFeePerGas,
              // @ts-ignore
              paymasterAndData: request.paymasterAndData ?? request.paymasterData,
            }
          })
        } catch (error) {
          console.error("Error sending user operation:", error);
          setLoading(false);
          setError("Error sending user operation");
          return;
        }
        try {
          const txHash = await submitterAccount.waitForUserOperationTransaction(uo);
          setTxHash(txHash);
        } catch (error) {
          console.error("Error waiting for transaction:", error);
          setLoading(false);
          setError("waitForUserOperationTransaction");
          return;
        }
      }
    } catch (error) {
      console.error("Error sending user operation:", error);
      setError("Unexpected error during transfer");
    } finally {
      setLoading(false);
    }
  }, [lightAccount, initiator, submitter, getUserOperationCallData]);

  return {
    getUserOperationCallData,
    transfer,
    txHash,
    error,  // Return the detailed error message
    setError,
    loading,
  };
}
