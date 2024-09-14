import { Hex } from "viem";

type Address = `0x${string}`;

export type User = {
  id: string
  email: string
  verified: boolean
  walletAddress?: Address | null
};

export type UserAndToken = User & { token: string };

export type UserPasskey = {
  id: string;
  name: string;
  registeredAt: Date;
};

export type Contact = {
  id: string;
  name: string;
  address: string;
};

export type MyRecoveryTeam = {
  id: string
  recoverer1Email: string
  recoverer1Address?: Address
  recoverer2Email: string
  recoverer2Address?: Address
  confirmed: boolean
}

export type MyRecoveryRequest = {
  id: string
  newAddress1: string
  newAddress2: string
  signature1?: Hex
  signature2?: Hex
  confirmed: boolean
}

export type JoinedRecoveryTeam = {
  id: string
  email: string
  joined: boolean
  confirmed: boolean
  recoverer1Address?: Address
  recoverer2Address?: Address
  request?: ReceivedRecoveryRequest
}

export type ReceivedRecoveryRequest = {
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
