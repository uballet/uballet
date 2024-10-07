import uballetAxios from "./fetcher";
import { JoinedRecoveryTeam, MyRecoveryRequest, MyRecoveryTeam, ReceivedRecoveryRequest } from "./types";

async function getRecoveryTeams() {
    const { data } = await uballetAxios.get<JoinedRecoveryTeam[]>(`/recovery/teams`, { params: { recoverer: true } });
    return data
}

async function getMyRecoveryTeam() {
    const { data } = await uballetAxios.get<MyRecoveryTeam>(`/recovery/teams`);
    return data
}

async function createRecoveryTeam({ recoverer1Email, recoverer2Email }: { recoverer1Email: string; recoverer2Email: string }) {
    const { data } = await uballetAxios.post<MyRecoveryTeam>(`/recovery/teams`, { email1: recoverer1Email, email2: recoverer2Email });
    return data
}

async function joinRecoveryTeam({ recoveryTeamId, address }: { recoveryTeamId: string, address: string }) {
    const { data } = await uballetAxios.post<JoinedRecoveryTeam>(`/recovery/teams/${recoveryTeamId}/join`, { address });
    return data
}

async function confirmRecoveryTeam({ recoveryTeamId }: { recoveryTeamId: string }) {
    const { data } = await uballetAxios.post<MyRecoveryTeam>(`/recovery/teams/${recoveryTeamId}/confirm`);
    return data
}

async function getMyRecoveryRequest() {
    const { data } = await uballetAxios.get<MyRecoveryRequest>('/recovery/requests');
    return data
}

async function requestRecovery({ address1, address2 }: { address1: string, address2: string }) {
    const { data } = await uballetAxios.post<MyRecoveryRequest>('/recovery/requests', { address1, address2 });
    return data
}

async function signRecovery({ id, signature, aggregatedSignature, callData }: { id: string, signature: string, aggregatedSignature: string, callData: string }) {
    const { data } = await uballetAxios.post<ReceivedRecoveryRequest>(`/recovery/requests/${id}/sign`, { signature, aggregatedSignature, callData });
    return data
}

async function confirmRecoveryRequest({ id }: { id: string }) {
    const { data } = await uballetAxios.post<ReceivedRecoveryRequest>(`/recovery/requests/${id}/complete`);
    return data
}

export default {
    createRecoveryTeam,
    confirmRecoveryTeam,
    confirmRecoveryRequest,
    getMyRecoveryTeam,
    getMyRecoveryRequest,
    getRecoveryTeams,
    joinRecoveryTeam,
    requestRecovery,
    signRecovery
}