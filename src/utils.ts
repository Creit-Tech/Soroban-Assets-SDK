import { DefaultContractTransactionGenerationResponse, SorobanAssetMethods } from './interfaces';
import { Account, Contract, Memo, Networks, TransactionBuilder, xdr } from '@stellar/stellar-sdk';
import { assembleTransaction, Server, Api } from '@stellar/stellar-sdk/lib/soroban';
import isSimulationError = Api.isSimulationError;

export async function prepareSorobanAssetTransaction(params: {
  sourceAccount: Account;
  fee: string;
  networkPassphrase: Networks;
  timeout: number;
  memo?: Memo;
  contract: Contract;
  contractMethod: SorobanAssetMethods;
  server: Server;
  scVals: xdr.ScVal[];
}): Promise<DefaultContractTransactionGenerationResponse> {
  const tx = new TransactionBuilder(params.sourceAccount, {
    fee: params.fee,
    networkPassphrase: params.networkPassphrase,
    memo: params.memo,
  })
    .setTimeout(params.timeout || 0)
    .addOperation(params.contract.call(params.contractMethod, ...params.scVals))
    .build();

  const simulated = await params.server.simulateTransaction(tx);

  if (isSimulationError(simulated)) {
    throw new Error(simulated.error);
  }

  const prepared = assembleTransaction(tx, simulated).build();

  return { transactionXDR: tx.toXDR(), simulated, preparedTransactionXDR: prepared.toXDR() };
}
