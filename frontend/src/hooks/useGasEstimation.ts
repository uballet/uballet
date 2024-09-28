import { useQuery } from "@tanstack/react-query";
import { useAccountContext } from "./useAccountContext";
import { useCallback } from "react";
import { UserOperationStruct } from "@aa-sdk/core";
import { formatEther, hexToBigInt, parseEther } from "viem";
import { useBalance } from "./useBalance";

const DEFAULT_VALUE = "0.00001"
const DEFAULT_TARGET = "0xc54ea2fde46a9dd4cf3a849c88ce62f8d8635205";
const DEFAULT_DATA = "0x";

export function formatUoEstimation(uo: UserOperationStruct) {
    // @ts-ignore
    const preVerifGas = hexToBigInt(uo.preVerificationGas!);
    // @ts-ignore
    const callGasLimit = hexToBigInt(uo.callGasLimit!);
    // @ts-ignore
    const verificationGas = hexToBigInt(uo.verificationGasLimit!);

    // @ts-ignore
    const maxFeePerGas: bigint = typeof uo.maxFeePerGas === "string" ? hexToBigInt(uo.maxFeePerGas) : uo.maxFeePerGas

    const estimation = formatEther((preVerifGas + callGasLimit + verificationGas) * maxFeePerGas);
    return {
      formatted: estimation,
      bigint: (preVerifGas + callGasLimit + verificationGas) * maxFeePerGas
    }
}

export function useGasEstimation({ target = DEFAULT_TARGET, data = DEFAULT_DATA, value = DEFAULT_VALUE }: { target?: `0x${string}`, data?: `0x${string}`, value?: string }) {
    const { lightAccount, initiator } = useAccountContext();
    const balance = useBalance();
    const estimateGas = useCallback(async () => {
      let uo: UserOperationStruct
      if (initiator) {
        const balance = await initiator.getBalance({
            address: initiator.getAddress()
        })
        if (balance === 0n) {
            return null
        }
        uo = await initiator.buildUserOperation({
          uo: {
            target: target.length === 42 ? target : DEFAULT_TARGET,
            data: data ?? "0x",
            value: parseEther(value),
          },
          context: {
            userOpSignatureType: "UPPERLIMIT",
          }
        })
      } else {
        const balance = await lightAccount!.getBalance({
            address: lightAccount!.getAddress()
        })
        if (balance === 0n) {
            return null
        }
        uo = await lightAccount!.buildUserOperation({
          uo: {
            target: target.length === 42 ? target : DEFAULT_TARGET,
            data: data ?? "0x",
            value: parseEther("0.0001"),
          }
        })
      }
  
      const { formatted } = formatUoEstimation(uo)
      return formatted
    }, [])
    const estimationQuery = useQuery({
      queryKey: ["gasEstimation", target, data],
      queryFn: async () => {
        return await estimateGas()
      }
    })
  
    return estimationQuery
}