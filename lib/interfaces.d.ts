import { Memo, Networks, SorobanRpc } from 'soroban-client';
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
export declare enum SorobanAssetMethods {
    allowance = "allowance",
    approve = "approve",
    balance = "balance",
    spendable_balance = "spendable_balance",
    transfer = "transfer",
    transfer_from = "transfer_from",
    burn = "burn",
    burn_from = "burn_from",
    decimals = "decimals",
    name = "name",
    symbol = "symbol",
    set_admin = "set_admin",
    admin = "admin",
    set_authorized = "set_authorized",
    authorized = "authorized",
    mint = "mint",
    clawback = "clawback"
}
export interface SorobanAssetsSDKParams {
    /**
     * The simulation account is the one used for pure view (read-only) methods like `balance`, `symbol`, etc
     * You don't need to own this account, but it must be an existing account on the network
     */
    simulationAccount: address;
    contractId: address;
    defaultFee: string;
    rpcUrl: string;
    allowHttp?: boolean;
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
    simulated: SorobanRpc.SimulateTransactionSuccessResponse;
}
//# sourceMappingURL=interfaces.d.ts.map