import {
  Account,
  Address,
  Contract,
  Memo,
  nativeToScVal,
  Networks,
  Operation,
  scValToBigInt,
  scValToNative,
  rpc,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';

export type u32 = number;
export type i128 = bigint;
export type address = string;

export interface AllowanceDataKey {
  from: address;
  spender: address;
}

export interface AllowanceValue {
  amount: i128;
  live_until_ledger: u32;
}

export interface BalanceValue {
  amount: i128;
  authorized: boolean;
  clawback: boolean;
}

export type DataKey = ['Allowance', AllowanceDataKey] | ['Balance', address];
export type InstanceDataKey = ['Admin'] | ['AssetInfo'];

export type DefaultCallParams<T> = T & {
  fee?: string;
  memo?: Memo;
};

export enum SorobanAssetMethods {
  allowance = 'allowance',
  approve = 'approve',
  balance = 'balance',
  spendable_balance = 'spendable_balance',
  transfer = 'transfer',
  transfer_from = 'transfer_from',
  burn = 'burn',
  burn_from = 'burn_from',
  decimals = 'decimals',
  name = 'name',
  symbol = 'symbol',
  set_admin = 'set_admin',
  admin = 'admin',
  set_authorized = 'set_authorized',
  authorized = 'authorized',
  mint = 'mint',
  clawback = 'clawback',
}

export interface SorobanAssetsSDKParams {
  /**
   * These are all from the Stellar SDK, import them and pass them to the object.
   * This is done this way because the `@stellar/stellar-sdk` package and its dependencies rely a lot on `instance of` logic,
   * that means that we need to use the same objects everytime we can so we avoid issues in those conditions.
   */
  stellarSDK: {
    Account: typeof Account;
    Address: typeof Address;
    Contract: typeof Contract;
    xdr: typeof xdr;
    TransactionBuilder: typeof TransactionBuilder;
    rpc: typeof rpc;
    nativeToScVal: typeof nativeToScVal;
    scValToNative: typeof scValToNative;
    scValToBigInt: typeof scValToBigInt;
    Operation: typeof Operation;
  };

  /**
   * The simulation account is the one used for pure view (read-only) methods like `balance`, `symbol`, etc
   * You don't need to own this account, but it must be an existing account on the network
   */
  simulationAccount: address;
  contractId: address;
  defaultFee: string;
  rpc: rpc.Server;
  network: Networks;
}

export type DefaultRequestParams<T> = T & {
  sourceAccount: address;
  timeout?: number;
  memo?: Memo;
};

export interface DefaultContractTransactionGenerationResponse {
  transactionXDR: string;
  preparedTransactionXDR: string;
  simulated: rpc.Api.SimulateTransactionSuccessResponse;
}
