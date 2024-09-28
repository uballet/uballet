import { useMutation, useQueryClient } from "@tanstack/react-query";
import uballet from "../../api/uballet";
import { useAccountContext } from "../useAccountContext";
import { toHex } from "viem";

export default function useConfirmRecoveryTeam() {
    const { initiator, submitter } = useAccountContext()
    const client = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ teamId, address1, address2 }: { teamId: string; address1: `0x${string}`; address2: `0x${string}`}) => {
            const uo = await initiator!.encodeUpdateOwnership({
                args: [[address1, address2], [], 2n]
            })

            const { signatureObj: signature1, aggregatedSignature, request } = await initiator!.proposeUserOperation({
                uo,
                overrides: {
                    preVerificationGas: toHex(53000n),
                }
            })

            const tx = await submitter!.sendUserOperation({
                uo,
                context: {
                    signatures: [signature1],
                    aggregatedSignature,
                    userOpSignatureType: "UPPERLIMIT",
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

            // const result = await submitter!.waitForUserOperationTransaction(tx)
            const data = await uballet.recovery.confirmRecoveryTeam({ recoveryTeamId: teamId })
            return data
        },
        onSuccess: () => {
            client.refetchQueries({ queryKey: ['recovery-teams'] })
            client.refetchQueries({ queryKey: ['my-recovery-team'] })
        }
    })

    return mutation
}