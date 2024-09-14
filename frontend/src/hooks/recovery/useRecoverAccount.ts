import { useMutation } from "@tanstack/react-query"
import uballet from "../../api/uballet"
import { JoinedRecoveryTeam } from "../../api/uballet/types"
import { useAccountContext } from "../useAccountContext"
import { useEffect } from "react"
import { Signature } from "@account-kit/smart-contracts"

export function useRecoverAccount() {
    const { account, createMultsigClient } = useAccountContext()
    const mutation = useMutation({
        mutationFn: async ({ recoveryTeam }: { recoveryTeam: JoinedRecoveryTeam }) => {
            const recoveryRequest = recoveryTeam.request
            if (!recoveryRequest?.needToSign) {
                return
            }
            const isFirstSignature = !recoveryRequest.signature1
            const signer = account!.account.getSigner()
            const recoveryClient = await createMultsigClient(signer, recoveryRequest.walletAddress)
            console.log({ recoveryRequest })
            if (isFirstSignature) {
                const uo = account!.encodeUpdateOwnership({
                    args: [[recoveryRequest.newAddress1, recoveryRequest.newAddress2], [], 2n],
                })
                const { signatureObj, aggregatedSignature, request } = await recoveryClient.proposeUserOperation({
                    uo: uo
                })

                console.log({ uo, signatureObj, aggregatedSignature })
                const updatedRecoverRequet = await uballet.recovery.signRecovery({ id: recoveryRequest.id, signature: signatureObj.signature, aggregatedSignature, callData: request.callData })
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

                const result = await recoveryClient!.waitForUserOperationTransaction(tx)

                console.log({ result })

                await uballet.recovery.confirmRecoveryRequest({ id: recoveryRequest.id })
            }
        }
    })

    return mutation
}