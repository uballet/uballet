import { useMutation, useQueryClient } from "@tanstack/react-query"
import uballet from "../../api/uballet"
import { JoinedRecoveryTeam } from "../../api/uballet/types"
import { useAccountContext } from "../useAccountContext"
import { Signature } from "@account-kit/smart-contracts"
import { useRouter } from "expo-router"

export function useRecoverAccount() {
    const { lightAccount, initiator, createMultsigClient } = useAccountContext()
    const account = lightAccount || initiator
    const client = useQueryClient();
    const router = useRouter();
    const mutation = useMutation({
        mutationFn: async ({ recoveryTeam }: { recoveryTeam: JoinedRecoveryTeam }) => {
            const recoveryRequest = recoveryTeam.request
            if (!recoveryRequest?.needToSign) {
                return
            }
            const isFirstSignature = !recoveryRequest.signature1
            const signer = account!.account.getSigner()
            const recoveryClient = await createMultsigClient(signer, recoveryRequest.walletAddress)
            if (isFirstSignature) {
                const uo = recoveryClient!.encodeUpdateOwnership({
                    args: [[recoveryRequest.newAddress1, recoveryRequest.newAddress2], [], 2n],
                })
                const { signatureObj, aggregatedSignature, request } = await recoveryClient.proposeUserOperation({
                    uo: uo
                })

                const updatedRecoverRequest = await uballet.recovery.signRecovery({ id: recoveryRequest.id, signature: signatureObj.signature, aggregatedSignature, callData: request.callData })
            } else {
                const { callData, signature1, aggregatedSignature } = recoveryRequest
                const signature: Signature = {
                    signature: signature1!,
                    signerType: 'EOA',
                    userOpSigType: 'UPPERLIMIT',
                    signer: recoveryTeam.recoverer1Address!
                }

                const tx = await recoveryClient!.sendUserOperation({
                    uo: callData!,
                    context: {
                        signatures: [signature],
                        aggregatedSignature: aggregatedSignature!,
                        userOpSignatureType: 'ACTUAL'
                    }
                })

                await uballet.recovery.confirmRecoveryRequest({ id: recoveryRequest.id })

                try {
                    const txHash = await recoveryClient.waitForUserOperationTransaction(tx)
                } catch (e) {
                    return router.replace({ pathname: '/(auth)/(tabs)/security/recovered', params: { user: recoveryTeam.email }})
                }
                return router.replace({ pathname: '/(auth)/(tabs)/security/recovered', params: { user: recoveryTeam.email, done: "true" } })
            }
        },
        onSuccess: () => {
            client.refetchQueries({ queryKey: ['recovery-teams'] })
            client.refetchQueries({ queryKey: ['my-recovery-team'] })
        }
    })

    return mutation
}