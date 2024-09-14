import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../providers/AuthProvider";
import { useAccountContext } from "../useAccountContext";
import { generateMnemonic } from "bip39";
import { LocalAccountSigner } from "@aa-sdk/core";
import { formatEther } from "ethers";
import { hexToBigInt } from "viem";

export function useRequestRecoveryEstimation() {
    const { user } = useAuthContext();
    const { sdkClient, createMultsigClient } = useAccountContext();
    const query = useQuery({
        queryKey: ['request-recovery-estimation', user],
        queryFn: async () => {
            const currentBalance = await sdkClient.core.getBalance(user!.walletAddress!);
            const signer = LocalAccountSigner.mnemonicToAccountSigner(generateMnemonic(), { accountIndex: 0 });
            const signer2 = LocalAccountSigner.mnemonicToAccountSigner(generateMnemonic(), { accountIndex: 1 });
            const recoveryClient = await createMultsigClient(signer, user!.walletAddress!);
            const encodedTransfer = await recoveryClient.encodeUpdateOwnership({
                args: [[await signer.getAddress(), await signer2.getAddress()], [], 2n],
            })
            const uo = await recoveryClient.buildUserOperation({
                uo: encodedTransfer,
                context: {
                    userOpSignatureType: 'UPPERLIMIT'
                },
            })
            console.log({ uo: encodedTransfer })
            // @ts-expect-error
            const callGasLimit = hexToBigInt(uo.callGasLimit!);
            // @ts-expect-error
            const verificationGasLimit = hexToBigInt(uo.verificationGasLimit!);
            // @ts-expect-error
            const preVerificationGas = hexToBigInt(uo.preVerificationGas!);
            
            const totalGas = callGasLimit + verificationGasLimit + preVerificationGas;

            const gasPrice = uo.maxPriorityFeePerGas!;
            // @ts-expect-error
            const estimation = totalGas * gasPrice;
            return {
                balance: formatEther(currentBalance.toBigInt()),
                totalEstimation: formatEther(estimation),
                preVerificationGas,
                verificationGasLimit,
                callGasLimit
            }
        },
        enabled: !!user
    })
    return query
}