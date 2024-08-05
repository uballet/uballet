import { useAccountContext } from "./useAccountContext";

export function useAlchemyClient() {
  const { client } = useAccountContext();

  if (!client) {
    throw new Error("Client not ready");
  }

  return client;
}
