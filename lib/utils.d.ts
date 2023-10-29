import { DefaultContractTransactionGenerationResponse, SorobanAssetMethods } from './interfaces';
import { Account, Contract, Memo, Networks, Server, xdr } from 'soroban-client';
export declare function prepareSorobanAssetTransaction(params: {
    sourceAccount: Account;
    fee: string;
    networkPassphrase: Networks;
    timeout: number;
    memo?: Memo;
    contract: Contract;
    contractMethod: SorobanAssetMethods;
    server: Server;
    scVals: xdr.ScVal[];
}): Promise<DefaultContractTransactionGenerationResponse>;
//# sourceMappingURL=utils.d.ts.map