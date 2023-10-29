import { address, DefaultContractTransactionGenerationResponse, DefaultRequestParams, i128, SorobanAssetsSDKParams, u32 } from './interfaces';
import { Asset, Contract, Memo, Networks, Server } from 'soroban-client';
export declare class SorobanAssetsSDK {
    private readonly globalParams;
    constructor(globalParams: SorobanAssetsSDKParams);
    get contract(): Contract;
    get server(): Server;
    static generateStellarAssetContractId(params: {
        asset: Asset;
        network: Networks;
    }): address;
    static wrapAsset(params: {
        sourceAccount: string;
        asset: Asset;
        rpcUrl: string;
        network: Networks;
        timeout?: number;
        memo?: Memo;
        defaultFee?: string;
        allowHttp?: boolean;
    }): Promise<DefaultContractTransactionGenerationResponse & {
        contractId: address;
    }>;
    getAllowance(params: {
        from: address;
        spender: address;
    }): Promise<i128>;
    approve(params: DefaultRequestParams<{
        from: address;
        spender: address;
        amount: i128;
        expirationLedger: u32;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    getBalance(account: address): Promise<i128>;
    getSpendableBalance(account: address): Promise<i128>;
    transfer(params: DefaultRequestParams<{
        from: address;
        to: address;
        amount: i128;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    transferFrom(params: DefaultRequestParams<{
        spender: address;
        from: address;
        to: address;
        amount: i128;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    burn(params: DefaultRequestParams<{
        from: address;
        amount: i128;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    burnFrom(params: DefaultRequestParams<{
        spender: address;
        from: address;
        amount: i128;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    getAssetDecimals(): Promise<u32>;
    getAssetName(): Promise<string>;
    getAssetSymbol(): Promise<string>;
    setAdmin(params: DefaultRequestParams<{
        newAdmin: address;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    getAdmin(): Promise<address>;
    setAuthorized(params: DefaultRequestParams<{
        id: address;
        authorize: boolean;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    checkIfAuthorized(account: address): Promise<boolean>;
    mint(params: DefaultRequestParams<{
        to: address;
        amount: i128;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
    clawback(params: DefaultRequestParams<{
        from: address;
        amount: i128;
    }>): Promise<DefaultContractTransactionGenerationResponse>;
}
//# sourceMappingURL=sdk.d.ts.map