import { useEffect, useState } from "react";
import { useAccountContext } from "./useAccountContext";
import { useSafeLightAccount } from "./useLightAccount";
import { formatEther } from "viem";

export function useBalance() {
  const account = useSafeLightAccount();
  const { client } = useAccountContext();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    client
      .getBalance({ address: account.address })
      .then((b) => setBalance(formatEther(b)));
    setLoading(false);
  }, []);

  return { balance, loading, error };
}
