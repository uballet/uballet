import { useMutation } from "@tanstack/react-query";
import uballet from "../../api/uballet";
import { useAccountContext } from "../useAccountContext";

export default function useConfirmRecoveryTeam() {
    const { initiator, submitter } = useAccountContext()
    const mutation = useMutation({
        mutationFn: async ({ teamId, address1, address2 }: { teamId: string; address1: `0x${string}`; address2: `0x${string}`}) => {
            const uo = await initiator!.encodeUpdateOwnership({
                args: [[address1, address2], [], 2n]
            })

            const { signatureObj: signature1, aggregatedSignature, request } = await initiator!.proposeUserOperation({
                uo
            })

            const tx = await submitter!.sendUserOperation({
                uo,
                context: {
                    signatures: [signature1],
                    aggregatedSignature,
                    userOpSignatureType: 'ACTUAL'
                }
            })

            const result = await submitter!.waitForUserOperationTransaction(tx)
            const data = await uballet.recovery.confirmRecoveryTeam({ recoveryTeamId: teamId })
            return data
        }
    })
    return mutation
}