import { useQuery } from "@tanstack/react-query";
import { useAccountContext } from "./useAccountContext";
import { useCallback } from "react";
import { UserOperationStruct } from "@aa-sdk/core";
import { formatEther, hexToBigInt, parseEther } from "viem";
import { pimlicoClients } from "../providers/AccountProvider";
import { useERC20 } from "./useERC20";
import { ethers } from "ethers";
import { useUsdcContractAddress } from "../providers/UsdcContractProvider";
import { useTransfer } from "./useTransfer";

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

export function useGasEstimation({ address, amount, tokenAddress }: { address: `0x${string}`, amount: string, tokenAddress?: `0x${string}`}) {
    const { lightAccount, initiator } = useAccountContext();
    const account = initiator || lightAccount
    const { getUserOperationCallData } = useTransfer()
    const estimateGas = useCallback(async () => {
      let uo: UserOperationStruct
      const { transferUoCallData } = await getUserOperationCallData({
        address,
        amount,
        tokenAddress
      })

      if (initiator) {
        uo = await initiator.buildUserOperation({
          uo: transferUoCallData,
          context: {
            userOpSignatureType: "UPPERLIMIT",
          }
        })
      } else {
        uo = await lightAccount!.buildUserOperation({
          uo: transferUoCallData,
        })
      }
  
      const { formatted } = formatUoEstimation(uo)
      return formatted
    }, [])
    const estimationQuery = useQuery({
      queryKey: ["gasEstimation", address, amount, tokenAddress, account?.chain?.id],
      queryFn: async () => {
        return await estimateGas()
      }
    })
  
    return estimationQuery
}



export function useERC20GasEstimation({ address, amount, tokenAddress }: { address: `0x${string}`, amount: string, tokenAddress?: `0x${string}` }) {
  // @ts-ignore
  const { erc20LightAccount, erc20Initiator, initiator } = useAccountContext();
  const account = erc20Initiator || erc20LightAccount
  const usdcAddress = useUsdcContractAddress()
  const { getTokenBalance } = useERC20()
  const { getUserOperationCallData } = useTransfer()
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
    const { transferUoCallData, usdcGasCallData} = await getUserOperationCallData({
      tokenAddress,
      address,
      amount,
      gasInUsdc: "1"
    })

    if (erc20Initiator) {
        uo = await erc20Initiator.buildUserOperation({ 
          uo: usdcGasCallData ? [usdcGasCallData, transferUoCallData] : transferUoCallData,
          context: {
            userOpSignatureType: "UPPERLIMIT",
          },
        })
    } else {
      uo = await erc20LightAccount!.buildUserOperation({ 
        uo: usdcGasCallData ? [usdcGasCallData, transferUoCallData] : transferUoCallData,
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
    queryKey: ["gasEstimation-erc20", address, amount, tokenAddress, account?.chain?.id],
    queryFn: async () => {
      return await estimateGas()
    }
  })

  return estimationQuery
}
