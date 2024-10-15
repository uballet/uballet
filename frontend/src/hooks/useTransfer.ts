import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { parseEther, toHex } from "viem";
import { ethers } from "ethers";

export function useTransfer() {
  const { lightAccount, initiator, submitter } = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [txHash, setTxHash] = useState<null | string>(null);
  
  const transferToAddress = useCallback(
    async (address: `0x${string}`, etherAmount: string) => {
      try {
        setLoading(true);
        if (lightAccount) {
          const uo = await lightAccount!.sendUserOperation({
            uo: {
              target: address,
              data: "0x",
              value: parseEther(etherAmount),
            },
          });
          const txHash = await lightAccount!.waitForUserOperationTransaction(uo);
          setTxHash(txHash);
        } else {
          const { signatureObj, aggregatedSignature, request } = await initiator!.proposeUserOperation({
            uo: {
              target: address,
              data: "0x",
              value: parseEther(etherAmount),
            },
            overrides: {
              preVerificationGas: toHex(50400n),
            }
          })

          const tx = await submitter!.sendUserOperation({
            uo: request.callData,
            context: {
              signatures: [signatureObj],
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
        }
      } catch (e) {
        console.error({ error: e });
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [lightAccount, initiator, submitter]
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
        if (lightAccount) {
          const uo = await lightAccount!.sendUserOperation({
            uo: {
              target: tokenContractAddress,
              data: data as `0x${string}`,
              value: BigInt(0),
            },
          });
          const txHash = await lightAccount.waitForUserOperationTransaction(uo);
          setTxHash(txHash);
        } else {
          const { signatureObj, aggregatedSignature, request } = await initiator!.proposeUserOperation({
            uo: {
              target: tokenContractAddress,
              data: data as `0x${string}`,
              value: BigInt(0),
            },
            overrides: {
              preVerificationGas: toHex(50400n),
            }
          })

          const tx = await submitter!.sendUserOperation({
            uo: request.callData,
            context: {
              signatures: [signatureObj],
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

          const txHash = await submitter!.waitForUserOperationTransaction(tx)
          setTxHash(txHash);
        }
      } catch (e) {
        console.error({ error: e });
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [lightAccount]
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
