import {ethers, JsonRpcProvider, Provider, TransactionRequest, Wallet} from 'ethers';
import { ALCHEMY_API_URL } from '../../../env';

/**
 * Types
 */
interface IInitArgs {
  mnemonic?: string;
}

/**
 * Library
 */
export default class EIP155Lib {
  wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  static init({mnemonic}: IInitArgs) {
    const provider = new JsonRpcProvider(ALCHEMY_API_URL);
    
    const wallet = mnemonic
      ? Wallet(provider)
      : Wallet.createRandom();

    return new EIP155Lib(wallet);
  }

  getMnemonic() {
    return this.wallet.mnemonic.phrase;
  }

  getAddress() {
    return this.wallet.address;
  }

  signMessage(message: string) {
    return this.wallet.signMessage(message);
  }

  _signTypedData(domain: any, types: any, data: any) {
    return this.wallet.signTypedData(domain, types, data);
  }

  connect(provider: JsonRpcProvider) {
    return this.wallet.connect(provider);
  }

  signTransaction(transaction: TransactionRequest) {
    return this.wallet.signTransaction(transaction);
  }
}
