import { parseEther } from "ethers";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";

import { getSignParamsMessage, getSignTypedDataParamsData } from "./HelperUtil";
import { EIP155_SIGNING_METHODS } from "./PresetsUtil";
import { AlchemyLightAccountClient, AlchemyMultisigClient } from "../../providers/AccountProvider";
import { toHex } from "viem";
type RequestEventArgs = Omit<
  SignClientTypes.EventArguments["session_request"],
  "verifyContext"
>;
export async function approveEIP155Request(
  requestEvent: RequestEventArgs,
  accountClient: { lightAccount: AlchemyLightAccountClient } | { initiator: AlchemyMultisigClient; submitter: AlchemyMultisigClient },
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;

  const { lightAccount } = accountClient as { lightAccount: AlchemyLightAccountClient };
  const { initiator, submitter } = accountClient as { initiator: AlchemyMultisigClient; submitter: AlchemyMultisigClient };


  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      try {
        console.log(request.params);
        const message = getSignParamsMessage(request.params);

        if (!message) {
          throw new Error("Message is empty");
        }
        if (lightAccount) {
          const signedMessage = await lightAccount.signMessage({
            message: message,
          });

          return formatJsonRpcResult(id, signedMessage);
        } else {
          const signedMessage = await initiator.signMessageWith6492({
            message: message,
          })
          return formatJsonRpcResult(id, signedMessage);
        }
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
          typedData: { domain, types, message: data, primaryType: "Mail" }
        };
        if (lightAccount) {
          const signedMessage = await lightAccount.signTypedData(args);
          return formatJsonRpcResult(id, signedMessage);
        } else {
          const signedMessage = await submitter.signTypedDataWith6492(args);
          return formatJsonRpcResult(id, signedMessage);
        }
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }
    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      try {
        if (lightAccount) {
          const toAddress = request.params[0].to;
          const amount = parseInt(request.params[0].value).toString();
          console.log(`sendTransaction with amount: ${amount} to ${toAddress}`);
          const uo = await lightAccount.sendUserOperation({
            uo: {
              target: toAddress,
              data: "0x",
              value: parseEther("0.0000001"),
            },
          });
          const txHash = await lightAccount.waitForUserOperationTransaction(uo);
          console.log(`sent transaction with hash: ${txHash}`);
          return formatJsonRpcResult(id, txHash);
        } else {
          const toAddress = request.params[0].to;
          const amount = parseInt(request.params[0].value).toString();
          console.log(`sendTransaction with amount: ${amount} to ${toAddress}`);
          const { request: uoRequest, signatureObj: signature, aggregatedSignature } = await initiator.proposeUserOperation({
            uo: {
              target: toAddress,
              data: "0x",
              value: parseEther('0.0001'),
            },
            overrides: {
              preVerificationGas: toHex(50400n),
            }
          })
          const tx = await submitter.sendUserOperation({
            uo: uoRequest.callData,
            context: {
              signatures: [signature],
              aggregatedSignature,
              userOpSignatureType: "UPPERLIMIT",
            },
            overrides: {
              preVerificationGas: uoRequest.preVerificationGas,
              callGasLimit: uoRequest.callGasLimit,
              verificationGasLimit: uoRequest.verificationGasLimit,
              maxFeePerGas: uoRequest.maxFeePerGas,
              maxPriorityFeePerGas: uoRequest.maxPriorityFeePerGas,
              // @ts-ignore
              paymasterAndData: uoRequest.paymasterAndData ?? uoRequest.paymasterData,
            }
          })
          const txHash = await submitter.waitForUserOperationTransaction(tx);

          console.log(`sent transaction with hash: ${tx.hash}`);
          return formatJsonRpcResult(id, txHash);

        }
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
