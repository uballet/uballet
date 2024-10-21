import { useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { formatEther } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useBlockchainContext } from "../providers/BlockchainProvider";

export function useBalance() {
  const { lightAccount, initiator } = useAccountContext();
  const { blockchain } = useBlockchainContext();

  const account = initiator || lightAccount;
  const query = useQuery({
    queryKey: ["balance", account?.getAddress(), account?.chain?.id],
    queryFn: async () => {
      if (!account) {
        return null;
      }
      const balance = await account.getBalance({
        address: account!.getAddress(),
      });
      console.log("BALANCE: ", { [account.chain!.name]: formatEther(balance), accountChain: account.chain?.id });
      return formatEther(balance);
    },
  })

  return query;
}
