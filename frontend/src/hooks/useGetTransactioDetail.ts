import { TransactionResponse } from "alchemy-sdk";
import { useState, useEffect } from "react";
import { useAccountContext } from "./useAccountContext";

export function useGetTransactioDetail(txHash: string) {
  const { sdkClient, account } = useAccountContext();
  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  if (!account) {
    throw new Error("Account not ready");
  }

  useEffect(() => {
    try {
      sdkClient.core.getTransaction(txHash).then((response) => {
        setLoading(false);
        setTransaction(response);
      });
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  }, []);

  return { transaction, loading };
}
