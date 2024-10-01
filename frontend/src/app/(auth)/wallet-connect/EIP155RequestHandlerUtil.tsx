import { ethers, isAddress, JsonRpcProvider, parseEther, Provider, verifyMessage, Wallet } from "ethers";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";

import { EIP155_SIGNING_METHODS, PresetsUtil } from "./PresetsUtil";
import {
  getSignParamsMessage,
} from "./HelperUtil";
import { LightAccount } from "@alchemy/aa-accounts"
import { useAccountContext } from "../../../hooks/useAccountContext";
import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
type RequestEventArgs = Omit<
  SignClientTypes.EventArguments["session_request"],
  "verifyContext"
>;
export async function approveEIP155Request(
  requestEvent: RequestEventArgs,
  wallet: Wallet,
  account: LightAccount,
  client: AlchemySmartAccountClient,
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
 

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      try {
        console.log(request.params);
        const message = getSignParamsMessage(request.params);
        const message1 = request.params.filter(p => !isAddress(p))[0];
        console.log(`message ${message}`);
        console.log(`message1 ${message1}`);
        console.log(`wallet ${wallet}`);
        
        if (!message) {
          throw new Error("Message is empty");
        }
        
        // Unlike Web3.js, Ethers seperates the provider instance and wallet instance, so we must also create a wallet instance
        
        const signedMe = await client.signMessage({
          account: account,
          message: message
        });

        const verified = await client.verifyMessage({
          address: account.address,
          message: message,
          signature: signedMe
        });

        const signerAddress = verifyMessage(message, signedMe);

        console.log('Recovered Address:', signerAddress);
        console.log(`signedMe ${signedMe}`);
        console.log(`verified ${verified}`);
        console.log('User Address:', account.address);
       
        return formatJsonRpcResult(id, signedMe);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      try {
        const toAddress = request.params[0].to;
        const amount = parseInt(request.params[0].value).toString();
        console.log(`sendTransaction with amount: ${amount} to ${toAddress}`);
        const uo = await client.sendUserOperation({
          account,
          uo: {
            target: toAddress,
            data: "0x",
            value: parseEther("0.0000001"),
          },
        });
        const txHash = await client.waitForUserOperationTransaction(uo);
        console.log(`sent transaction with hash: ${txHash}`);
        return formatJsonRpcResult(id, txHash);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }

    default:
      throw new Error(getSdkError("INVALID_METHOD").message);
  }
}

export function rejectEIP155Request(request: RequestEventArgs) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError("USER_REJECTED").message);
}
