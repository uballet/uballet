import express, { Request, Response } from 'express';
import RecoveryService from '../services/recovery'
import { authenticateToken } from '../jwt-authentication';
import { RecoveryTeam } from '../entity/RecoveryTeam';
import { User } from '../entity/User';
import { RecoveryRequest } from '../entity/RecoveryRequest';
import { Address, Hex } from '../types'

type MyRecoveryTeam = {
    id: string
    recoverer1Email: string
    recoverer1Address?: Address
    recoverer2Email: string
    recoverer2Address?: Address
    confirmed: boolean
}

type MyRecoveryRequest = {
    id: string
    newAddress1: string
    newAddress2: string
    signature1?: Hex
    signature2?: Hex
}

type JoinedTeam = {
    id: string
    email: string
    recoverer1Address?: Address
    recoverer2Address?: Address
    joined: boolean
    confirmed: boolean
    request?: ReceivedRequest
}

type ReceivedRequest = {
    id: string
    email: string
    recoveryTeamId: string
    walletAddress: Address
    newAddress1: Address
    newAddress2: Address
    signature1?: Hex
    signature2?: Hex
    callData?: Hex
    aggregatedSignature?: Hex
    needToSign: boolean
}

const router = express.Router();

function formatJoinedTeam(recoveryTeam: RecoveryTeam, user: User, requests?: RecoveryRequest[]): JoinedTeam {
    let joined = recoveryTeam.recoverer1Id === user.id && recoveryTeam.recoverer1Address
    if (!joined) {
        joined = recoveryTeam.recoverer2Id === user.id && recoveryTeam.recoverer2Address
    }
    const request = requests?.find(request => request.recoveryTeamId === recoveryTeam.id)
    return {
        id: recoveryTeam.id,
        email: recoveryTeam.user.email,
        joined: !!joined,
        recoverer1Address: recoveryTeam.recoverer1Address,
        recoverer2Address: recoveryTeam.recoverer2Address,
        confirmed: recoveryTeam.userConfirmed,
        request: request && formatReceivedRequest(request, user)
    }
}

function formatOwnedTeam(recoveryTeam: RecoveryTeam | null): MyRecoveryTeam | null {
    if (!recoveryTeam) {
        return null
    }
    return {
        id: recoveryTeam.id,
        recoverer1Email: recoveryTeam.recoverer1.email,
        recoverer1Address: recoveryTeam.recoverer1Address,
        recoverer2Email: recoveryTeam.recoverer2.email,
        recoverer2Address: recoveryTeam.recoverer2Address,
        confirmed: recoveryTeam.userConfirmed
    }
}

function formatMyRequest(request: RecoveryRequest | null): MyRecoveryRequest | null {
    if (!request) {
        return null
    }
    return {
        id: request.id,
        newAddress1: request.newAddress1,
        newAddress2: request.newAddress2,
        signature1: request.signature1,
        signature2: request.signature2,
    }
}

function formatReceivedRequest(request: RecoveryRequest, user: User): ReceivedRequest {
    const team = request.recoveryTeam
    let needToSign = team.recoverer1Id === user.id && !request.signature1

    if (!needToSign) {
        needToSign = !!request.signature1 && team.recoverer2Id === user.id && !request.signature2
    }

    return {
        id: request.id,
        email: team.user.email,
        recoveryTeamId: team.id,
        walletAddress: team.user.walletAddress,
        newAddress1: request.newAddress1,
        newAddress2: request.newAddress2,
        callData: request.callData,
        signature1: request.signature1,
        signature2: request.signature2,
        aggregatedSignature: request.aggregatedSignature,
        needToSign
    }
}
router.post('/teams', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { email1, email2 } = req.body
    const recoveryTeam = await RecoveryService.createRecoveryTeam({ user, recoverer1Email: email1, recoverer2Email: email2 })
    return res.status(200).json(formatJoinedTeam(recoveryTeam, user))
})
router.post('/teams/:id/join', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { id } = req.params
    const { address } = req.body
    const recoveryTeam = await RecoveryService.joinRecoveryTeam({ user, recoveryTeamId: id, address })
    return res.status(200).json(formatJoinedTeam(recoveryTeam, user))   
})

router.post('/teams/:id/confirm', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { id } = req.params
    const recoveryTeam = await RecoveryService.confirmRecoveryTeam({ user, recoveryTeamId: id })
    return res.status(200).json(formatOwnedTeam(recoveryTeam))
})

router.get('/teams', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { recoverer } = req.query

    if (recoverer === "true") {
        const recoveryTeams = await RecoveryService.getJoinedTeams({ user })
        const requests = await RecoveryService.getOngoingRecoveryRequests({ user })
        return res.status(200).json(recoveryTeams.map((team => formatJoinedTeam(team, user, requests))))
    }
    const recoveryTeam = await RecoveryService.getMyRecoveryTeam({ user })
    return res.status(200).json(formatOwnedTeam(recoveryTeam))
})

router.post('/requests', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { address1, address2 } = req.body

    const request = await RecoveryService.requestRecovery({ user, address1, address2 })
    return res.status(200).json(formatMyRequest(request))
})

router.get('/requests', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { recoverer } = req.query
    if (recoverer === "true") {
        const recoveryRequests = await RecoveryService.getOngoingRecoveryRequests({ user })
        return res.status(200).json(recoveryRequests.map((request => formatReceivedRequest(request, user))))
    }
    const request = await RecoveryService.getMyRecoveryRequest({ user })
    return res.status(200).json(formatMyRequest(request))
})

router.post('/requests/:id/sign', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { id } = req.params
    const { signature, aggregatedSignature, callData } = req.body
    const request = await RecoveryService.signRecoveryRequest({ user, requestId: id, signature, aggregatedSignature, callData })
    return res.status(200).json(formatReceivedRequest(request, user ))
})

router.post('/requests/:id/complete', authenticateToken, async (req: Request, res: Response) => {
    const user = res.locals.user
    const { id } = req.params
    const request = await RecoveryService.completeRecoveryRequest({ user, requestId: id })
    return res.status(200).json(formatReceivedRequest(request, user))
})

export default router