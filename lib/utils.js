"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareSorobanAssetTransaction = void 0;
const soroban_client_1 = require("soroban-client");
var isSimulationError = soroban_client_1.SorobanRpc.isSimulationError;
async function prepareSorobanAssetTransaction(params) {
    const tx = new soroban_client_1.TransactionBuilder(params.sourceAccount, {
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
    const prepared = (0, soroban_client_1.assembleTransaction)(tx, params.networkPassphrase, simulated).build();
    return { transactionXDR: tx.toXDR(), simulated, preparedTransactionXDR: prepared.toXDR() };
}
exports.prepareSorobanAssetTransaction = prepareSorobanAssetTransaction;
