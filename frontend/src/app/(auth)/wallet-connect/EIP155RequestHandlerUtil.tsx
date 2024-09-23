import { ethers, isAddress, JsonRpcProvider, Provider, verifyMessage, Wallet } from "ethers";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";

import { EIP155_SIGNING_METHODS, PresetsUtil } from "./PresetsUtil";
import {
  getSignParamsMessage,
} from "./HelperUtil";
import { LightAccount } from "@alchemy/aa-accounts"
type RequestEventArgs = Omit<
  SignClientTypes.EventArguments["session_request"],
  "verifyContext"
>;
export async function approveEIP155Request(
  requestEvent: RequestEventArgs,
  wallet: Wallet,
  account: LightAccount
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
        
        const signedMe = await account.signMessage({message: message1});
        const signedMessage = await wallet.signMessage(message1);
        const signerAddress = verifyMessage(message, signedMe);
        const signedAddress = verifyMessage(message1, signedMessage);

        console.log('Recovered Address:', signerAddress);
        console.log('Recovered Address:', signedAddress);
        console.log(`signedMe ${signedMe}`);
        console.log(`signedMessage ${signedMessage}`);
        console.log('User Address:', account.address);
       
        return formatJsonRpcResult(id, signedMessage);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      try {
        const chainData = PresetsUtil.getChainData(chainId.split(":")[1]);
        const provider = new JsonRpcProvider(chainData.rpcUrl);
        //const sendTransaction = request.params[0];
        //const connectedWallet = wallet.connect(provider);
        //const { hash } = await connectedWallet.sendTransaction(sendTransaction);
        return formatJsonRpcResult(id, "hash");
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
