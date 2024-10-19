import { useEffect, useState } from "react";
import { useAccountContext } from "../useAccountContext";
import { Core } from "@walletconnect/core";
import "@walletconnect/react-native-compat";
import Client, { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { SessionTypes } from "@walletconnect/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "./EIP155RequestHandlerUtil";
import { useSafeLightAccount } from "../useLightAccount";

const projectId = "bcf04074fe19f9c2663524759ae56420";
const WALLET_CONNECTIONS = "wallet_connections";
// 2. Create config
const metadata = {
  name: "Uballet",
  description: "Uballet dApp using smartcontracts",
  url: "https://github.com/uballet/uballet",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  redirect: {
    native: "uballet://index",
  },
};

export type ModalData = {
  visible: boolean;
  title: string;
  subtitle: string;
  askAmount?: boolean;
};

export type SnackbarData = {
  visible: boolean;
  success?: boolean;
  text: string;
};

export function useWalletConnect() {
  const [connector, setConnector] = useState<Client>();
  const [activeSessions, setActiveSessions] =
    useState<Record<string, SessionTypes.Struct>>();
  const [modalData, setModalData] = useState<ModalData>({
    visible: false,
    title: "",
    subtitle: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState<SnackbarData>({
    visible: false,
    text: "",
  });
  const [approvedCallback, setApprovedCallback] = useState(
    () => (input: string) => console.log("Initial function")
  );
  const [rejectedCallback, setRejectedCallback] = useState(
    () => () => console.log("Initial function")
  );

  const account = useSafeLightAccount();
  const { client } = useAccountContext();

  function handleSendTransaction(
    connector: Client,
    requestEvent: Web3WalletTypes.SessionRequest
  ) {
    const { topic } = requestEvent;
    setModalData({
      visible: true,
      title: "Confirm send Transaction",
      subtitle: "Do you want to send a transaction?",
      askAmount: true,
    });
    setApprovedCallback(() => async (input: string) => {
      try {
        const response = await approveEIP155Request(
          requestEvent,
          account,
          client,
          input
        );
        console.log("Response: ", response);
        await connector.respondSessionRequest({
          topic,
          response,
        });
        setLoading(false);
        setSnackbarData({
          visible: true,
          text: "Transaction sent",
        });
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
      }
    });

    setRejectedCallback(() => async () => {
      try {
        let response = rejectEIP155Request(requestEvent);
        await connector.respondSessionRequest({
          topic,
          response,
        });
      } catch (e) {
        console.log((e as Error).message, "error");
        return;
      }
    });
  }

  function handlePersonalSign(
    connector: Client,
    requestEvent: Web3WalletTypes.SessionRequest
  ) {
    const { topic } = requestEvent;
    setModalData({
      visible: true,
      title: "Confirm sign",
      subtitle: "Do you want to sign this message?",
    });
    setApprovedCallback(() => async () => {
      try {
        setLoading(true);
        const response = await approveEIP155Request(
          requestEvent,
          account,
          client,
          undefined
        );
        console.log("Response: ", response);
        await connector.respondSessionRequest({
          topic,
          response,
        });
        setLoading(false);
        setSnackbarData({
          visible: true,
          text: "Message signed",
        });
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
      }
    });

    setRejectedCallback(() => async () => {
      try {
        let response = rejectEIP155Request(requestEvent);
        await connector.respondSessionRequest({
          topic,
          response,
        });
        setSnackbarData({
          visible: true,
          text: "Sign rejected",
        });
      } catch (e) {
        console.log((e as Error).message, "error");
        return;
      }
    });
  }

  function handleSessionDelete(connector: Client) {
    connector.on("session_delete", async (session: any) => {
      console.log("Session delete: ", session);
      setSnackbarData({
        visible: true,
        text: "Session deleted from dApp",
      });
      await saveSession(connector);
    });
  }

  function handleSessionRequest(connector: Client) {
    connector.on(
      "session_request",
      async (requestEvent: Web3WalletTypes.SessionRequest) => {
        console.log("onSessionRequest: ", requestEvent.params.request.method);
        const { params } = requestEvent;
        const { request } = params;

        switch (request.method) {
          case "personal_sign":
          case "eth_sign":
            handlePersonalSign(connector, requestEvent);
            break;
          case "eth_sendTransaction":
            handleSendTransaction(connector, requestEvent);
            break;
          case "eth_signTypedData_v4":
            handlePersonalSign(connector, requestEvent);
            break;
          default:
            console.log("onSessionRequest", requestEvent);
        }
      }
    );
  }

  function handlePing(connector: Client) {
    connector.engine.signClient.events.on("session_ping", (data) => {
      console.log("session_ping received", data);
      setSnackbarData({
        visible: true,
        text: "Session ping received",
      });
    });
  }

  function loadActiveSessions(connector: Client) {
    let jsonData = undefined;
    var activeSessions = {};
    if (jsonData) {
      console.log("Active sessions from storage");
      activeSessions = JSON.parse(jsonData);
      setActiveSessions(activeSessions);
    } else {
      console.log("Active sessions from connector");
      let activeSessions = connector.getActiveSessions();
      console.log("Active sessions: ", activeSessions);
      for (const [key, value] of Object.entries(activeSessions)) {
        connector
          .extendSession({ topic: value.topic })
          .then(() => {
            console.log("Session updated: ", value.topic);
          })
          .catch((error) => {
            console.log("Error updating session: ", getSdkError(error));
          });
      }
      setActiveSessions(activeSessions);
    }
  }

  function handleSessionProposal(connector: Client) {
    connector.on(
      "session_proposal",
      async (proposal: Web3WalletTypes.SessionProposal) => {
        try {
          console.log("Session proposal: ", proposal);
          // TODO - refactor `approvedNamespaces` generation
          const approvedNamespaces = buildApprovedNamespaces({
            proposal: proposal.params,
            supportedNamespaces: {
              eip155: {
                chains: [
                  "eip155:10", // Optimism Mainnet
                  "eip155:42161", // Arbitrum Mainnet
                  "eip155:420", // Optimism Goerli (testnet)
                  "eip155:421613", // Arbitrum Goerli (testnet)
                  "eip155:84531", // Base Mainnet
                  "eip155:11155111", // Sepolia
                ],
                methods: [
                  "eth_sendTransaction",
                  "personal_sign",
                  "eth_signTypedData_v4",
                  "eth_signTransaction",
                ],
                events: ["accountsChanged", "chainChanged", "message"],
                accounts: [
                  `eip155:11155111:${account.address}`, // Sepolia
                  `eip155:10:${account.address}`, // Optimism
                  `eip155:42161:${account.address}`, // Arbitrum
                  `eip155:420:${account.address}`, // Optimism Goerli
                  `eip155:421613:${account.address}`, // Arbitrum Goerli
                  `eip155:84531:${account.address}`, // Base
                ],
              },
            },
          });

          console.log("Approved namespaces: ", approvedNamespaces);
          setModalData({
            visible: true,
            title: "Session Proposal",
            subtitle: "Do you want to approve this session?",
          });

          setApprovedCallback(() => async () => {
            try {
              const session = await connector.approveSession({
                id: proposal.id,
                namespaces: approvedNamespaces,
              });
              setSnackbarData({
                visible: true,
                text: "Session approved",
              });
              setModalData({
                visible: false,
                title: "",
                subtitle: "",
              });
              await saveSession(connector);
              loadActiveSessions(connector);
              console.log("Session approved: ", session);
            } catch (error) {
              console.log("Error approving session: ", getSdkError(error));
            }
          });

          setRejectedCallback(() => async () => {
            try {
              setSnackbarData({
                visible: true,
                text: "Session rejected",
              });
              await connector.rejectSession({
                id: proposal.id,
                reason: getSdkError("USER_REJECTED"),
              });
            } catch (error) {
              console.log("Error rejecting session: ", getSdkError(error));
            }
          });
        } catch (error) {
          console.log("Error approving session: ", getSdkError(error));
        }
      }
    );
  }

  async function saveSession(connector: Client) {
    let activeSessions = connector.getActiveSessions();
    const jsonData = JSON.stringify(activeSessions);
    await AsyncStorage.setItem(WALLET_CONNECTIONS, jsonData);
    // loadActiveSessions(connector);
  }

  async function deleteSession(topic: string) {
    if (connector) {
      await connector.disconnectSession({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
      loadActiveSessions(connector);
      setSnackbarData({
        visible: true,
        text: "Session deleted",
      });
    }
  }

  async function pairWcuri(wcuri: string) {
    if (connector) {
      try {
        await connector.pair({ uri: wcuri });
        await saveSession(connector);
        loadActiveSessions(connector);
      } catch (error) {
        console.log("Error pairing session: ", getSdkError(error));
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    console.log("Initializing connector");
    const core = new Core({
      projectId: projectId,
      name: "Uballet",
    });
    Web3Wallet.init({
      core, // <- pass the shared `core` instance
      metadata: metadata,
    })
      .then((connector) => {
        console.log("Web3Wallet initialized");
        setConnector(connector);
        handleSessionProposal(connector);
        handleSessionDelete(connector);
        handleSessionRequest(connector);
        handlePing(connector);
        loadActiveSessions(connector);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error initializing Web3Wallet: ", error);
      });
  }, []);

  return {
    connector,
    activeSessions,
    loading,
    modalData,
    snackbarData,
    approvedCallback,
    rejectedCallback,
    deleteSession,
    pairWcuri,
  };
}
