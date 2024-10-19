import { parseEther } from "ethers";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";

import { getSignParamsMessage, getSignTypedDataParamsData } from "./HelperUtil";
import { LightAccount } from "@alchemy/aa-accounts";
import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { EIP155_SIGNING_METHODS } from "./PresetsUtil";
type RequestEventArgs = Omit<
  SignClientTypes.EventArguments["session_request"],
  "verifyContext"
>;
export async function approveEIP155Request(
  requestEvent: RequestEventArgs,
  account: LightAccount,
  client: AlchemySmartAccountClient,
  input: string | undefined
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      try {
        console.log(request.params);
        const message = getSignParamsMessage(request.params);

        if (!message) {
          throw new Error("Message is empty");
        }

        const signedMessage = await client.signMessage({
          account: account,
          message: message,
        });

        return formatJsonRpcResult(id, signedMessage);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      try {
        const {
          domain,
          types,
          message: data,
        } = getSignTypedDataParamsData(request.params);
        const args = {
          typedData: { domain, types, message: data, primaryType: "Mail" },
          account: account,
        };
        const signedMessage = await client.signTypedData(args);
        return formatJsonRpcResult(id, signedMessage);
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
        if (!input) {
          throw new Error("No amount specified");
        }
        const uo = await client.sendUserOperation({
          account,
          uo: {
            target: toAddress,
            data: "0x",
            value: parseEther(input),
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
