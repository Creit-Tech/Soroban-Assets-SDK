import {
  DefaultContractTransactionGenerationResponse,
  SorobanAssetMethods,
  SorobanAssetsSDKParams,
} from './interfaces';
import { Account, Contract, Memo, Networks, rpc, xdr } from '@stellar/stellar-sdk';

export async function prepareSorobanAssetTransaction(params: {
  sdk: SorobanAssetsSDKParams['stellarSDK'];
  sourceAccount: Account;
  fee: string;
  networkPassphrase: Networks;
  timeout: number;
  memo?: Memo;
  contract: Contract;
  contractMethod: SorobanAssetMethods;
  server: rpc.Server;
  scVals: xdr.ScVal[];
}): Promise<DefaultContractTransactionGenerationResponse> {
  const tx = new params.sdk.TransactionBuilder(params.sourceAccount, {
    fee: params.fee,
    networkPassphrase: params.networkPassphrase,
    memo: params.memo,
  })
    .setTimeout(params.timeout || 0)
    .addOperation(params.contract.call(params.contractMethod, ...params.scVals))
    .build();

  const simulated = await params.server.simulateTransaction(tx);

  if (params.sdk.rpc.Api.isSimulationError(simulated)) {
    throw new Error(simulated.error);
  }

  const prepared = params.sdk.rpc.assembleTransaction(tx, simulated).build();

  return { transactionXDR: tx.toXDR(), simulated, preparedTransactionXDR: prepared.toXDR() };
}
