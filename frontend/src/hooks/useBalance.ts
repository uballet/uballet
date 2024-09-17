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
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh

  const getBalance = () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching ETH balance...");
      client
        .getBalance({ address: account.address })
        .then((b) => setBalance(formatEther(b)));
    } catch {
      console.error("Error fetching balance");
      setError("Error fetching balance");
      setLoading(false);
    } finally {
      console.log("ETH balance fetched");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Running useBalance useEffect...");
    if (account.address) {
      getBalance();
    }
    console.log("Finished useBalance useEffect");
  }, [refreshKey]);

  // Function to trigger data refresh
  const refreshData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return { balance, loading, error, refreshData };
}
