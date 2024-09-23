import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types";
import {
  PasskeyAuthenticationResult,
  PasskeyRegistrationResult,
} from "react-native-passkey";
import {
  Contact,
  type User,
  type UserAndToken,
  type UserPasskey,
} from "./types";

import uballetAxios, { setUballetToken, getUballetToken, removeUballetToken } from "./fetcher";
import recovery from "./recovery";
import notifications from "./notifications";

const signUp = ({ email }: { email: string }) => {
  return uballetAxios.post<User>(`/signup`, { email });
};

export { setUballetToken, getUballetToken, removeUballetToken };

const verifyEmail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const {
    data: { token, ...user },
  } = await uballetAxios.post<UserAndToken>(`/verify-email`, { email, code });

  return {
    user,
    token,
  };
};

const getPasskeyRegistrationOptions = async ({
  userId,
}: {
  userId: string;
}) => {
  const { data: options } =
    await uballetAxios.get<PublicKeyCredentialCreationOptionsJSON>(
      `/passkey-registration-options`,
      { params: { userId } }
    );
  return options;
};

const verifyPasskeyRegistration = async ({
  userId,
  credentials,
  challenge,
}: {
  userId: string;
  credentials: PasskeyRegistrationResult;
  challenge: string;
}) => {
  const { data: passkey } = await uballetAxios.post<UserPasskey>(
    `/verify-passkey-registration`,
    { userId, credentials, challenge }
  );
  return passkey;
};

const getPasskeyAuthenticationOptions = async () => {
  const { data: options } =
    await uballetAxios.get<PublicKeyCredentialCreationOptionsJSON>(
      `/passkey-authentication-options`
    );
  return options;
};

const verifyPasskeyAuthentication = async ({
  credentials,
  challenge,
}: {
  credentials: PasskeyAuthenticationResult;
  challenge: string;
}) => {
  const {
    data: { token, ...user },
  } = await uballetAxios.post<UserAndToken>(`/verify-passkey-authentication`, {
    credentials,
    challenge,
  });
  return { user, token };
};

const getUserPasskeys = async ({ userId }: { userId: string }) => {
  const { data: passkeys } = await uballetAxios.get<UserPasskey[]>(
    `/passkeys`,
    { params: { userId } }
  );
  return passkeys;
};

const startEmailLogin = async ({ email }: { email: string }) => {
  await uballetAxios.post(`/email-sign-in`, { email });
};

const getCurrentUser = async () => {
  const { data: user } = await uballetAxios.get<User>(`/user`);
  console.log({ user })
  return user;
};

const completeSignIn = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const {
    data: { token, ...user },
  } = await uballetAxios.post<UserAndToken>(`/complete-sign-in`, {
    email,
    code,
  });
  return {
    token,
    user,
  };
};

async function getContacts() {
  const { data } = await uballetAxios.get<Contact[]>("/contacts");
  return data;
}

async function addContact({
  name,
  address,
}: {
  name: string;
  address: string;
}) {
  const { data } = await uballetAxios.post<Contact>("/contacts", {
    name,
    address,
  });
  return data;
}

async function registerDeviceToken({ token }: { token: string }) {
  const { data } = await uballetAxios.post('/user/device-token', {
    token,
  });
  return data;
}

async function getQuote({ coin }: { coin: string }) {
  // Make a GET request to /quote with the coin parameter as a query parameter
  const { data } = await uballetAxios.get("/quotes", { params: { coin } });
  return data;
}

async function getPortfolioData({ days }: { days: number }) {
  // Make a GET request to /portfolio
  const { data } = await uballetAxios.get("portfolio/historical_values", {
    params: { last_days: days },
  });
  return data;
}

async function setUserWalletAddress({
  walletAddress,
  walletType
}: {
  walletAddress: string;
  walletType: 'light' | 'multisig'
}) {
  const { data } = await uballetAxios.post<User>("/user/wallet-address", {
    walletAddress,
    walletType
  });
  console.log(data);
  return data;
}

export default {
  addContact,
  completeSignIn,
  getPasskeyAuthenticationOptions,
  getPasskeyRegistrationOptions,
  getContacts,
  getCurrentUser,
  getUserPasskeys,
  registerDeviceToken,
  signUp,
  startEmailLogin,
  setUserWalletAddress,
  verifyEmail,
  verifyPasskeyRegistration,
  verifyPasskeyAuthentication,
  getQuote,
  recovery,
  notifications,
  getPortfolioData,
};
