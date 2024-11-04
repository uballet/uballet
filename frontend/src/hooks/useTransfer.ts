import { useCallback, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { parseEther, parseUnits, toHex } from "viem";
import { ethers } from "ethers";
import { useUsdcContractAddress } from "../providers/UsdcContractProvider";

export function useTransfer() {
  // @ts-ignore
  const { lightAccount, erc20LightAccount, initiator, erc20Initiator, submitter, erc20Submitter } = useAccountContext();
  const { sdkClient } = useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);  // Store error message instead of just a boolean
  const [txHash, setTxHash] = useState<null | string>(null);
  const usdcAddress = useUsdcContractAddress()

  const transferToAddress = useCallback(
    async (address: `0x${string}`, etherAmount: string, usdcTokenGas?: string) => {
      setLoading(true);
      setError(null);

      const withErc20 = !!usdcTokenGas;
      try {
        const abi = ["function approve(address,uint)"];
        const iface = new ethers.Interface(abi);
        const tokenApprovalData = iface.encodeFunctionData("approve", [
          "0x00000000000000fb866daaa79352cc568a005d96",
          parseUnits(usdcTokenGas ?? "1", 6)
        ]);

        const tokenApprovalUo = {
          target: usdcAddress as `0x${string}`,
          data: tokenApprovalData as `0x${string}`,
          value: 0n
        }

        if (lightAccount) {
          let uo;
          if (withErc20) {
            try {
              uo = await erc20LightAccount!.sendUserOperation({
                uo: [
                  tokenApprovalUo,
                  {
                    target: address,
                    data: "0x",
                    value: parseEther(etherAmount),
                  }
                ],
                overrides: {
                  preVerificationGas: { multiplier: 3 },
                }
              });
            } catch (e) {
              console.error("Error during client.sendUserOperation:", e);
              setError("Error during client.sendUserOperation");
              return;
            }
            try {
              const txHash = await erc20LightAccount.waitForUserOperationTransaction(uo);
              setTxHash(txHash);
            } catch (e) {
              setError("waitForUserOperationTransaction");
            }
          } else {
            try {
              uo = await lightAccount.sendUserOperation({
                uo: {
                  target: address,
                  data: "0x",
                  value: parseEther(etherAmount),
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
          }
        } else if (initiator && submitter) {
          let tx
          if (withErc20) {
            try {
              const { signatureObj, aggregatedSignature, request } = await erc20Initiator!.proposeUserOperation({
                uo: [
                  tokenApprovalUo,
                  {
                  target: address,
                  data: "0x",
                  value: parseEther(etherAmount),
                }],
                overrides: {
                  preVerificationGas: { multiplier: 3 },
                }
              })

              tx = await erc20Submitter.sendUserOperation({
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
              const txHash = await erc20Submitter!.waitForUserOperationTransaction(tx);
              setTxHash(txHash);
            } catch (e) {
              setError("waitForUserOperationTransaction");
            }
          } else {
            try {
              const { signatureObj, aggregatedSignature, request } = await initiator.proposeUserOperation({
                uo: {
                  target: address,
                  data: "0x",
                  value: parseEther(etherAmount),
                },
                overrides: {
                  preVerificationGas: { multiplier: 3 },
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
      amount: string,
      usdcTokenGas?: string
    ) => {
      setLoading(true);
      setError(null);  // Clear previous error

      const withErc20 = !!usdcTokenGas;
      console.log({ usdcTokenGas })
      const abi = ["function approve(address,uint)"];
      const iface = new ethers.Interface(abi);
      const tokenApprovalData = iface.encodeFunctionData("approve", [
        "0x00000000000000fb866daaa79352cc568a005d96",
        parseUnits(usdcTokenGas ?? "1", 6)
      ]);

      const tokenApprovalUo = {
        target: usdcAddress as `0x${string}`,
        data: tokenApprovalData as `0x${string}`,
        value: 0n
      }

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
          if (withErc20) {

            try {
              uo = await erc20LightAccount.sendUserOperation({
                uo: [
                  tokenApprovalUo,
                  {
                  target: tokenContractAddress,
                  data: data as `0x${string}`,
                  value: BigInt(0),
                  }
                ],
                overrides: {
                  preVerificationGas: { multiplier: 2 },
                }
              });
            } catch (e) {
              console.error("Error during client.sendUserOperation:", e);
              setError("sendUserOperation");
              return;
            }
            try {
              const txHash = await erc20LightAccount.waitForUserOperationTransaction(uo);
              setTxHash(txHash);
            } catch (e) {
              setError("waitForUserOperationTransaction");
            }
          } else {
            try {
              uo = await lightAccount.sendUserOperation({
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
              const txHash = await lightAccount.waitForUserOperationTransaction(uo);
              setTxHash(txHash);
            } catch (e) {
              setError("waitForUserOperationTransaction");
            }
          }
        } else if (initiator && submitter) {
          if (withErc20) {
            const { signatureObj, aggregatedSignature, request } = await erc20Initiator.proposeUserOperation({
              uo: [
                tokenApprovalUo,
                {
                  target: tokenContractAddress,
                  data: data as `0x${string}`,
                  value: BigInt(0),
                },
              ],
              overrides: {
                preVerificationGas: { multiplier: 2 },
              }
            })
  
            const tx = await erc20Submitter.sendUserOperation({
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
  
            const txHash = await erc20Submitter.waitForUserOperationTransaction(tx)
            setTxHash(txHash);
          } else {
            const { signatureObj, aggregatedSignature, request } = await initiator.proposeUserOperation({
              uo: {
                target: tokenContractAddress,
                data: data as `0x${string}`,
                value: BigInt(0),
              },
              overrides: {
                preVerificationGas: { multiplier: 3 },
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
