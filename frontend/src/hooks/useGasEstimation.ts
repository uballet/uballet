import { useQuery } from "@tanstack/react-query";
import { useAccountContext } from "./useAccountContext";
import { useCallback } from "react";
import { UserOperationStruct } from "@aa-sdk/core";
import { formatEther, hexToBigInt, parseEther } from "viem";
import { pimlicoClients } from "../providers/AccountProvider";
import { useERC20 } from "./useERC20";
import { ethers } from "ethers";
import { useUsdcContractAddress } from "../providers/UsdcContractProvider";

const DEFAULT_VALUE = "0.00001"
const DEFAULT_TARGET = "0xc54ea2fde46a9dd4cf3a849c88ce62f8d8635205";
const DEFAULT_DATA = "0x";

export function formatUoEstimation(uo: UserOperationStruct, postOpGas?: bigint, exchangeRate?: bigint) {
    // @ts-ignore
    const preVerifGas = hexToBigInt(uo.preVerificationGas!);
    // @ts-ignore
    const callGasLimit = hexToBigInt(uo.callGasLimit!);
    // @ts-ignore
    const verificationGas = hexToBigInt(uo.verificationGasLimit!);

    // @ts-ignore
    const maxFeePerGas: bigint = typeof uo.maxFeePerGas === "string" ? hexToBigInt(uo.maxFeePerGas) : uo.maxFeePerGas
    const estimation = (preVerifGas + callGasLimit + verificationGas) * maxFeePerGas
    const formatted = formatEther(estimation);
    let formattedInUsdc: string | null = null
    let usdcGas: bigint | null = null
    if (postOpGas && exchangeRate) {
      usdcGas = ((estimation + postOpGas * maxFeePerGas) * exchangeRate)
      formattedInUsdc = formatEther(usdcGas / BigInt(1e6))
    }
    return {
      formatted,
      bigint: (preVerifGas + callGasLimit + verificationGas) * maxFeePerGas,
      formattedInUsdc,
      usdcGas
    }
}

export function useGasEstimation({ target = DEFAULT_TARGET, data = DEFAULT_DATA, value = DEFAULT_VALUE }: { target?: `0x${string}`, data?: `0x${string}`, value?: string }) {
    const { lightAccount, initiator } = useAccountContext();
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



export function useERC20GasEstimation({ target = DEFAULT_TARGET, data = DEFAULT_DATA, value = DEFAULT_VALUE }: { target?: `0x${string}`, data?: `0x${string}`, value?: string }) {
  // @ts-ignore
  const { erc20LightAccount, erc20Initiator } = useAccountContext();
  const account = erc20Initiator || erc20LightAccount
  const usdcAddress = useUsdcContractAddress()
  const { getTokenBalance } = useERC20()
  const estimateGas = useCallback(async () => {
    let uo: UserOperationStruct
    const pimlicoClient = pimlicoClients[await account!.chain!.id]
    const [tokenQuotes, usdcTokenBalance] = await Promise.all([
      pimlicoClient.getTokenQuotes({
        chain: undefined,
        tokens: [usdcAddress],
      }),
      getTokenBalance(account!.getAddress(), usdcAddress)
    ])

    if (erc20Initiator) {
      uo = await erc20Initiator.buildUserOperation({ 
        uo: {
          target: target.length === 42 ? target : DEFAULT_TARGET,
          data: data ?? "0x",
          value: parseEther(value),
        },
        context: {
          userOpSignatureType: "UPPERLIMIT",
        },
      })
    } else {
      uo = await erc20LightAccount!.buildUserOperation({ 
        uo: {
          target: target.length === 42 ? target : DEFAULT_TARGET,
          data: data ?? "0x",
          value: parseEther("0.0001"),
        }
      })
    }

    const { formattedInUsdc } = formatUoEstimation(uo, tokenQuotes[0]?.postOpGas, tokenQuotes[0]?.exchangeRate)
    const formattedUsdcBalance = ethers.formatUnits(usdcTokenBalance, 6);
    const intPartOfGas = parseInt(formattedInUsdc!.split(".")[0]) + 1.5
    const intPartOfBalance = Math.floor(parseInt(formattedUsdcBalance.split(".")[0]))
    
    const enoughInUsdc = intPartOfGas <= intPartOfBalance
    return { formattedInUsdc: intPartOfGas.toString(), formattedUsdcBalance, enoughInUsdc }
  }, [account])
  const estimationQuery = useQuery({
    queryKey: ["gasEstimation-erc20", target, data, account?.chain?.id],
    queryFn: async () => {
      return await estimateGas()
    }
  })

  console.log({ error: estimationQuery.error })

  return estimationQuery
}
