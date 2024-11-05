import { User } from "../entity/User"
import { RecoveryTeam } from "../entity/RecoveryTeam";
import { RecoveryRequest } from "../entity/RecoveryRequest";
import { Address, Hex } from "../types";
import EmailService from "./email"
import NotificationService from "./notification"

async function createRecoveryTeam({ user, recoverer1Email, recoverer2Email, chain }: { user: User; recoverer1Email: string; recoverer2Email: string; chain: string }) {
    const recoveryTeam = new RecoveryTeam()
    recoveryTeam.user = user
    const recoverer1 = await User.findOne({ where: { email: recoverer1Email } })
    const recoverer2 = await User.findOne({ where: { email: recoverer2Email } })
    let notificationPromises = []
    if (!recoverer1) {
        const newUser = new User();
        newUser.email = recoverer1Email
        recoveryTeam.recoverer1 = await newUser.save()
        notificationPromises.push(EmailService.sendEmail(recoverer1Email, 'UBALLET - Join Recovery Team', `User ${user.email} wants you to be their recoverer. Join now!`))
    } else {
        recoveryTeam.recoverer1 = recoverer1
        notificationPromises.push(NotificationService.createNotification({ userId: recoverer1.id, title: `${recoverer1.email}: Join Recovery Team`, body: `User ${user.email} wants you to be their recoverer.`, type: 'recovery-team-invite', sendPush: true }))

    }

    if (!recoverer2) {
        const newUser = new User();
        newUser.email = recoverer2Email
        recoveryTeam.recoverer2 = await newUser.save()
        notificationPromises.push(EmailService.sendEmail(recoverer2Email, 'UBALLET - Join Recovery Team', `User ${user.email} wants you to be their recoverer. Join now!`))
    } else {
        recoveryTeam.recoverer2 = recoverer2
        notificationPromises.push(NotificationService.createNotification({ userId: recoverer2.id, title: `${recoverer2.email}: Join Recovery Team`, body: `User ${user.email} wants you to be their recoverer.`, type: 'recovery-team-invite', sendPush: true }))
    }

    recoveryTeam.chain = chain
    await Promise.all(notificationPromises)
    await recoveryTeam.save()
    return recoveryTeam
}

async function getMyRecoveryTeam({ user, chain }: { user: User; chain: string }) {
    return await RecoveryTeam.findOne({ where: { userId: user.id, chain }, loadEagerRelations: true })
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
    await NotificationService.createNotification({ userId: recoveryTeam.userId, title: `Recovery Team Joined`, body: `User ${user.email} has joined your recovery team.`, type: 'recovery-team-joined', sendPush: true })
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
        NotificationService.createNotification({ userId: recoveryTeam.recoverer1Id, title: `Recovery Team Confirmed`, body: `User ${user.email} has confirmed their recovery team.`, sendPush: true, type: 'recovery-team-confirmed' }),
        NotificationService.createNotification({ userId: recoveryTeam.recoverer2Id, title: `Recovery Team Confirmed`, body: `User ${user.email} has confirmed their recovery team.`, sendPush: true, type: 'recovery-team-confirmed' }),
    ])
    return recoveryTeam
}

async function getJoinedTeams({ user, chain }: { user: User, chain: string }) {
    return await RecoveryTeam.find({ where: [{ recoverer1Id: user.id, chain }, { recoverer2Id: user.id, chain }], loadEagerRelations: true })
}

async function requestRecovery({ user, address1, address2, chain }: { user: User; address1: Address; address2: Address, chain: string }) {
    const team = await RecoveryTeam.findOneOrFail({ where: { userId: user.id, userConfirmed: true, chain }, loadEagerRelations: true })

    const newRequest = new RecoveryRequest()
    newRequest.recoveryTeam = team
    newRequest.newAddress1 = address1
    newRequest.newAddress2 = address2

    await newRequest.save()
    await Promise.all([
        NotificationService.createNotification({ userId: team.recoverer1Id, title: `Recovery Request`, body: `User ${user.email} has requested an account recovery.`, type: 'recovery-request', sendPush: true }),
        NotificationService.createNotification({ userId: team.recoverer2Id, title: `Recovery Request`, body: `User ${user.email} has requested an account recovery.`, type: 'recovery-request', sendPush: true }),
    ])
    return newRequest
}

async function getOngoingRecoveryRequests({ user, chain }: { user: User; chain: string }) {
    const requests = await RecoveryRequest
        .find({ where: { recoveryTeam: [{ recoverer1Id: user.id, chain }, { recoverer2Id: user.id, chain }], status: "pending" }, loadEagerRelations: true })

    return requests
}

async function getMyRecoveryRequest({ user, chain }: { user: User; chain: string }) {
    const requests = await RecoveryRequest
        .findOne({ where: { recoveryTeam: { userId: user.id, chain }, status: "pending" }, loadEagerRelations: true })

    return requests
}

async function signRecoveryRequest({ user, signature, aggregatedSignature, requestId, callData }: { user: User; signature: Hex; aggregatedSignature: Hex, requestId: string; callData: Hex }) {
    const request = await RecoveryRequest.findOneOrFail({ where: { id: requestId } })
    request.signature1 = signature
    request.aggregatedSignature = aggregatedSignature
    request.callData = callData
    await request.save()
    await NotificationService.createNotification({ userId: request.recoveryTeam.userId, title: `Recovery Request Signed`, body: `User ${user.email} has signed your recovery request.`, type: 'recovery-request-signed', sendPush: true })
    return request
}

async function completeRecoveryRequest({ requestId }: { user: User; requestId: string }) {
    const request = await RecoveryRequest.findOneOrFail({ where: { id: requestId } })
    request.status = "confirmed"
    await request.save()
    await NotificationService.createNotification({ userId: request.recoveryTeam.userId, title: `Recovery Completed`, body: `Your account recovery has been completed.`, type: 'recovery-completed', sendPush: true })
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