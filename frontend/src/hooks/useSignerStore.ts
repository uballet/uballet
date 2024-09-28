import { LocalAccountSigner } from "@aa-sdk/core";
import { User } from "../api/uballet/types";
import * as SecureStore from 'expo-secure-store'
import { useCallback } from "react";
import { useAuthContext } from "../providers/AuthProvider";

type SignerPair = [LocalAccountSigner<any>, LocalAccountSigner<any>];

function getSignersFromSeedphrase(seedphrase: string): SignerPair {
    const signer1 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 0 });
    const signer2 = LocalAccountSigner.mnemonicToAccountSigner(seedphrase, { accountIndex: 1 });
    return [signer1, signer2]
  }

async function getStoredSigners(user: User): Promise<SignerPair | null> {
    const seedphrase = await SecureStore.getItemAsync(`seedphrase-${user.id}`);
    if (!seedphrase) {
        return null
    }
    return getSignersFromSeedphrase(seedphrase);
}
  
async function getStoredSeedphrase(user: User): Promise<string | null> {
    return SecureStore.getItemAsync(`seedphrase-${user.id}`);
}

async function storeSeedPhrase(user: User, seedPhrase: string) {
    await SecureStore.setItemAsync(`seedphrase-${user.id}`, seedPhrase);
    return getSignersFromSeedphrase(seedPhrase);
}

async function storeRecoverySeedPhrase(user: User, seedphrase: string): Promise<SignerPair> {
    await SecureStore.setItemAsync(`recovery-seedphrase-${user.id}`, seedphrase);
    return getSignersFromSeedphrase(seedphrase);
}

async function getRecoverySeedphrase(user: User): Promise<string | null> {
    const recoverySeedphrase = await SecureStore.getItemAsync(`recovery-seedphrase-${user.id}`);
    return recoverySeedphrase
}

async function promoteRecoverySeedPhrase(user: User) {
    const recoverySeedphrase = await SecureStore.getItemAsync(`recovery-seedphrase-${user.id}`);
    if (!recoverySeedphrase) {
        return
    }
    await SecureStore.setItemAsync(`seedphrase-${user.id}`, recoverySeedphrase);
    await SecureStore.deleteItemAsync(`recovery-seedphrase-${user.id}`);
}

async function loadRecoverySignersForUser(user: User): Promise<SignerPair | null> {
    const recoverySeedphrase = await getRecoverySeedphrase(user);
    if (!recoverySeedphrase) {
        return null
    }
    return getSignersFromSeedphrase(recoverySeedphrase);
}

export function useSignerStore() {
    const { user } = useAuthContext()

    const loadSeedphrase = useCallback(async () => {
        const seedphrase = await getStoredSeedphrase(user!)
        return seedphrase
    }, [user])

    const loadSigners = useCallback(async () => {
        const signers = await getStoredSigners(user!)
        return signers
    }, [user])

    const storeSeedphrase = useCallback(async (seedPhrase: string) => {
        const signers = await storeSeedPhrase(user!, seedPhrase)
        return signers
    }, [user])

    const loadRecoverySeedphrase = useCallback(async () => {
        const recoverySeedphrase = await getRecoverySeedphrase(user!)
        return recoverySeedphrase
    }, [user])

    const storeRecoverySeedphrase = useCallback(async (seedphrase: string) => {
        const signers = await storeRecoverySeedPhrase(user!, seedphrase)
        return signers
    }, [user])

    const promoteRecoverySeedphrase = useCallback(async () => {
        await promoteRecoverySeedPhrase(user!)
    }, [user])

    const loadRecoverySigners = useCallback(() => {
        return loadRecoverySignersForUser(user!)
    }, [user])

    return {
        loadSeedphrase,
        loadSigners,
        storeSeedphrase,
        loadRecoverySeedphrase,
        storeRecoverySeedphrase,
        promoteRecoverySeedphrase,
        loadRecoverySigners
    }
}