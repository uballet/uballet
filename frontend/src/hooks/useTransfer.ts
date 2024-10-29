import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { parseEther, toHex } from "viem";
import { ethers } from "ethers";

export function useTransfer() {
  const { lightAccount, initiator, submitter } = useAccountContext();
  const { sdkClient } = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);  // Store error message instead of just a boolean
  const [txHash, setTxHash] = useState<null | string>(null);
  
  const transferToAddress = useCallback(
    async (address: `0x${string}`, etherAmount: string) => {
      setLoading(true);
      setError(null);
      try {
        setLoading(true);
        if (lightAccount) {
          let uo;
          try {
            uo = await lightAccount.sendUserOperation({
              uo: {
                target: address,
                data: "0x",
                value: parseEther(etherAmount),
              },
              overrides: {
                maxFeePerGas: { multiplier: 1.5 },
                maxPriorityFeePerGas: { multiplier: 1.25 }
              }
            });
          } catch (e) {
            console.error("Error during client.sendUserOperation:", e);
            setError("Error during client.sendUserOperation");
            return;
          }
  
          try {
            const txHash = await lightAccount.waitForUserOperationTransaction(uo);
            setTxHash(txHash);
          } catch (e) {
            setError("waitForUserOperationTransaction");
          }
        } else if (initiator && submitter) {
          let tx
          try {
            const { signatureObj, aggregatedSignature, request } = await initiator.proposeUserOperation({
              uo: {
                target: address,
                data: "0x",
                value: parseEther(etherAmount),
              },
              overrides: {
                preVerificationGas: toHex(50400n),
                maxFeePerGas: { multiplier: 1.5 },
                maxPriorityFeePerGas: { multiplier: 1.25 }
              }
            })

            tx = await submitter.sendUserOperation({
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
          } catch (e) {
            console.error("Error during client.sendUserOperation:", e);
            setError("Error during client.sendUserOperation");
            return;
          }
          try {
            const txHash = await submitter!.waitForUserOperationTransaction(tx);
            setTxHash(txHash);
          } catch (e) {
            setError("waitForUserOperationTransaction");
          }
        }
      } catch (e) {
        console.error({ error: e });
        setError("Unexpected error during transfer");
      } finally {
        setLoading(false);
      }
    },
    [lightAccount, initiator, submitter]
  );

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
        if (lightAccount) {
          let uo;
          try {
            uo = await lightAccount.sendUserOperation({
              uo: {
                target: tokenContractAddress,
                data: data as `0x${string}`,
                value: BigInt(0),
              },
              overrides: {
                maxFeePerGas: { multiplier: 1.5 },
                maxPriorityFeePerGas: { multiplier: 1.25 }
              }
            });
          } catch (e) {
            console.error("Error during client.sendUserOperation:", e);
            setError("sendUserOperation");
            return;
          }
  
          try {
            const txHash = await lightAccount.waitForUserOperationTransaction(uo);
            setTxHash(txHash);
          } catch (e) {
            setError("waitForUserOperationTransaction");
          }
        } else if (initiator && submitter) {
          const { signatureObj, aggregatedSignature, request } = await initiator.proposeUserOperation({
            uo: [{
              target: tokenContractAddress,
              data: data as `0x${string}`,
              value: BigInt(0),
            }],
            overrides: {
              preVerificationGas: toHex(50400n),
              maxFeePerGas: { multiplier: 1.5 },
              maxPriorityFeePerGas: { multiplier: 1.25 }
            }
          })

          const tx = await submitter.sendUserOperation({
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

          const txHash = await submitter.waitForUserOperationTransaction(tx)
          setTxHash(txHash);
        }
      } catch (e) {
        console.error({ error: e });
        setError("Unexpected error during token transfer");
      } finally {
        setLoading(false);
      }
    },
    [lightAccount, initiator, submitter]
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
