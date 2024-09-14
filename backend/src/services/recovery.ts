import { User } from "../entity/User"
import { RecoveryTeam } from "../entity/RecoveryTeam";
import { RecoveryRequest } from "../entity/RecoveryRequest";
import { Address, Hex } from "../types";

import PushNotificationService from "../services/push-notification"

async function createRecoveryTeam({ user, recoverer1Email, recoverer2Email }: { user: User; recoverer1Email: string; recoverer2Email: string }) {
    const recoveryTeam = new RecoveryTeam()
    recoveryTeam.user = user
    const recoverer1 = await User.findOneOrFail({ where: { email: recoverer1Email } })
    const recoverer2 = await User.findOneOrFail({ where: { email: recoverer2Email } })

    recoveryTeam.recoverer1 = recoverer1
    recoveryTeam.recoverer2 = recoverer2
    await Promise.all([
        PushNotificationService.sendNotificationToUser({ userId: recoverer1.id, title: `${recoverer1.email}: Join Recovery Team`, body: `User ${user.email} wants you to be their recoverer.` }),
        PushNotificationService.sendNotificationToUser({ userId: recoverer2.id, title: `${recoverer2.email}: Join Recovery Team`, body: `User ${user.email} wants you to be their recoverer.` })
    ])
    await recoveryTeam.save()
    return recoveryTeam
}

async function getMyRecoveryTeam({ user }: { user: User }) {
    return await RecoveryTeam.findOne({ where: { userId: user.id }, loadEagerRelations: true })
}

async function joinRecoveryTeam({ user, recoveryTeamId, address }: { user: User; recoveryTeamId: string, address: Address }) {
    const recoveryTeam = await RecoveryTeam.findOneOrFail({ where: { id: recoveryTeamId }, loadEagerRelations: true })
    if (recoveryTeam.recoverer1Id !== user.id && recoveryTeam.recoverer2Id !== user.id) {
        throw new Error("User is not a member of this team")
    }
    if (recoveryTeam.recoverer1Id === user.id) {
        recoveryTeam.recoverer1Address = address
    }
    if (recoveryTeam.recoverer2Id === user.id) {
        recoveryTeam.recoverer2Address = address
    }
    await recoveryTeam.save()
    await PushNotificationService.sendNotificationToUser({ userId: recoveryTeam.userId, title: `Recovery Team Joined`, body: `User ${user.email} has joined your recovery team.` })
    return recoveryTeam
}

async function confirmRecoveryTeam({ user, recoveryTeamId }: { user: User; recoveryTeamId: string }) {
    const recoveryTeam = await RecoveryTeam.findOneOrFail({ where: { id: recoveryTeamId }, loadEagerRelations: true })
    if (recoveryTeam.userId !== user.id) {
        throw new Error("User is not owner of this team")
    }
    recoveryTeam.userConfirmed = true
    await recoveryTeam.save()
    await Promise.all([
        PushNotificationService.sendNotificationToUser({ userId: recoveryTeam.recoverer1Id, title: `Recovery Team Confirmed`, body: `User ${user.email} has confirmed their recovery team.` }),
        PushNotificationService.sendNotificationToUser({ userId: recoveryTeam.recoverer2Id, title: `Recovery Team Confirmed`, body: `User ${user.email} has confirmed their recovery team.` })
    ])
    return recoveryTeam
}

async function getJoinedTeams({ user }: { user: User }) {
    return await RecoveryTeam.find({ where: [{ recoverer1Id: user.id }, { recoverer2Id: user.id }], loadEagerRelations: true })
}

async function requestRecovery({ user, address1, address2 }: { user: User; address1: Address; address2: Address }) {
    const team = await RecoveryTeam.findOneOrFail({ where: { userId: user.id, userConfirmed: true }, loadEagerRelations: true })

    const newRequest = new RecoveryRequest()
    newRequest.recoveryTeam = team
    newRequest.newAddress1 = address1
    newRequest.newAddress2 = address2

    await newRequest.save()
    await Promise.all([
        PushNotificationService.sendNotificationToUser({ userId: team.recoverer1Id, title: `Recovery Request`, body: `User ${user.email} has requested an account recovery.` }),
        PushNotificationService.sendNotificationToUser({ userId: team.recoverer2Id, title: `Recovery Request`, body: `User ${user.email} has requested an account recovery.` })
    ])
    return newRequest
}

async function getOngoingRecoveryRequests({ user }: { user: User }) {
    const requests = await RecoveryRequest
        .find({ where: { recoveryTeam: [{ recoverer1Id: user.id }, { recoverer2Id: user.id }], status: "pending" }, loadEagerRelations: true })

    return requests
}

async function getMyRecoveryRequest({ user }: { user: User }) {
    const requests = await RecoveryRequest
        .findOne({ where: { recoveryTeam: { userId: user.id }, status: "pending" }, loadEagerRelations: true })

    return requests
}

async function signRecoveryRequest({ user, signature, aggregatedSignature, requestId, callData }: { user: User; signature: Hex; aggregatedSignature: Hex, requestId: string; callData: Hex }) {
    const request = await RecoveryRequest.findOneOrFail({ where: { id: requestId } })
    request.signature1 = signature
    request.aggregatedSignature = aggregatedSignature
    request.callData = callData
    await request.save()
    await PushNotificationService.sendNotificationToUser({ userId: request.recoveryTeam.userId, title: `Recovery Request Signed`, body: `User ${user.email} has signed your recovery request.` })
    return request
}

async function completeRecoveryRequest({ requestId }: { user: User; requestId: string }) {
    const request = await RecoveryRequest.findOneOrFail({ where: { id: requestId } })
    request.status = "confirmed"
    await request.save()
    await PushNotificationService.sendNotificationToUser({ userId: request.recoveryTeam.userId, title: `Recovery Completed`, body: `Your account recovery has been completed.` })
    return request
}

export default {
    createRecoveryTeam,
    joinRecoveryTeam,
    getMyRecoveryTeam,
    confirmRecoveryTeam,
    getJoinedTeams,
    requestRecovery,
    getOngoingRecoveryRequests,
    getMyRecoveryRequest,
    signRecoveryRequest,
    completeRecoveryRequest
}