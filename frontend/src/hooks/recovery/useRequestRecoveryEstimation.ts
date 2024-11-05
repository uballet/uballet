import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../providers/AuthProvider";
import { useAccountContext } from "../useAccountContext";
import { generateMnemonic } from "bip39";
import { LocalAccountSigner } from "@aa-sdk/core";
import { formatUoEstimation } from "../useGasEstimation";
import { formatEther, parseEther } from "viem";

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
            const estimation = await formatUoEstimation(uo)
            return {
                estimation: estimation.formatted,
                currentBalance: formatEther(currentBalance.toBigInt()),
                isEnough: currentBalance.gt(estimation.bigint)
            }
        },
        enabled: !!user
    })
    return query
}