"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorobanAssetsSDK = void 0;
const interfaces_1 = require("./interfaces");
const soroban_client_1 = require("soroban-client");
const utils_1 = require("./utils");
var isSimulationError = soroban_client_1.SorobanRpc.isSimulationError;
class SorobanAssetsSDK {
    constructor(globalParams) {
        this.globalParams = globalParams;
    }
    get contract() {
        return new soroban_client_1.Contract(this.globalParams.contractId);
    }
    get server() {
        return new soroban_client_1.Server(this.globalParams.rpcUrl, { allowHttp: !!this.globalParams.allowHttp });
    }
    static generateStellarAssetContractId(params) {
        const contractIdPreimage = soroban_client_1.xdr.HashIdPreimage.envelopeTypeContractId(new soroban_client_1.xdr.HashIdPreimageContractId({
            networkId: (0, soroban_client_1.hash)(Buffer.from(params.network)),
            contractIdPreimage: soroban_client_1.xdr.ContractIdPreimage.contractIdPreimageFromAsset(params.asset.toXDRObject()),
        }));
        return soroban_client_1.StrKey.encodeContract((0, soroban_client_1.hash)(contractIdPreimage.toXDR()));
    }
    static async wrapAsset(params) {
        const server = new soroban_client_1.Server(params.rpcUrl, { allowHttp: !!params.allowHttp });
        const account = await server.getAccount(params.sourceAccount);
        const tx = new soroban_client_1.TransactionBuilder(account, {
            fee: params.defaultFee || '1000000',
            networkPassphrase: params.network,
            memo: params.memo,
        })
            .setTimeout(params.timeout || 0)
            .addOperation(soroban_client_1.Operation.invokeHostFunction({
            func: soroban_client_1.xdr.HostFunction.hostFunctionTypeCreateContract(new soroban_client_1.xdr.CreateContractArgs({
                contractIdPreimage: soroban_client_1.xdr.ContractIdPreimage.contractIdPreimageFromAsset(params.asset.toXDRObject()),
                executable: soroban_client_1.xdr.ContractExecutable.contractExecutableToken(),
            })),
            auth: [],
        }))
            .build();
        const simulated = await server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        const prepared = (0, soroban_client_1.assembleTransaction)(tx, params.network, simulated).build();
        return {
            contractId: SorobanAssetsSDK.generateStellarAssetContractId(params),
            preparedTransactionXDR: prepared.toXDR(),
            transactionXDR: tx.toXDR(),
            simulated,
        };
    }
    async getAllowance(params) {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.allowance, new soroban_client_1.Address(params.from).toScVal(), new soroban_client_1.Address(params.spender).toScVal()))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToBigInt)(simulated.result.retval);
    }
    async approve(params) {
        const from = new soroban_client_1.Address(params.from).toScVal();
        const spender = new soroban_client_1.Address(params.spender).toScVal();
        const amount = (0, soroban_client_1.nativeToScVal)(params.amount, { type: 'i128' });
        const expiration_ledger = (0, soroban_client_1.nativeToScVal)(params.expirationLedger, { type: 'u32' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.approve,
            server: this.server,
            scVals: [from, spender, amount, expiration_ledger],
        });
    }
    async getBalance(account) {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.balance, new soroban_client_1.Address(account).toScVal()))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToBigInt)(simulated.result.retval);
    }
    async getSpendableBalance(account) {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.spendable_balance, new soroban_client_1.Address(account).toScVal()))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToBigInt)(simulated.result.retval);
    }
    async transfer(params) {
        const from = new soroban_client_1.Address(params.from).toScVal();
        const to = new soroban_client_1.Address(params.to).toScVal();
        const amount = (0, soroban_client_1.nativeToScVal)(params.amount, { type: 'i128' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.transfer,
            server: this.server,
            scVals: [from, to, amount],
        });
    }
    async transferFrom(params) {
        const spender = new soroban_client_1.Address(params.spender).toScVal();
        const from = new soroban_client_1.Address(params.from).toScVal();
        const to = new soroban_client_1.Address(params.to).toScVal();
        const amount = (0, soroban_client_1.nativeToScVal)(params.amount, { type: 'i128' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.transfer_from,
            server: this.server,
            scVals: [spender, from, to, amount],
        });
    }
    async burn(params) {
        const from = new soroban_client_1.Address(params.from).toScVal();
        const amount = (0, soroban_client_1.nativeToScVal)(params.amount, { type: 'i128' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.burn,
            server: this.server,
            scVals: [from, amount],
        });
    }
    async burnFrom(params) {
        const spender = new soroban_client_1.Address(params.spender).toScVal();
        const from = new soroban_client_1.Address(params.from).toScVal();
        const amount = (0, soroban_client_1.nativeToScVal)(params.amount, { type: 'i128' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.burn_from,
            server: this.server,
            scVals: [spender, from, amount],
        });
    }
    async getAssetDecimals() {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.decimals))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToNative)(simulated.result.retval);
    }
    async getAssetName() {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.name))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToNative)(simulated.result.retval);
    }
    async getAssetSymbol() {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.symbol))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToNative)(simulated.result.retval).replace(/[^a-z0-9]/gi, '');
    }
    // TODO: Needs to be tested
    async setAdmin(params) {
        const newAdmin = new soroban_client_1.Address(params.newAdmin).toScVal();
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.transfer_from,
            server: this.server,
            scVals: [newAdmin],
        });
    }
    // TODO: Needs to be tested
    async getAdmin() {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.admin))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToNative)(simulated.result.retval);
    }
    // TODO: Needs to be tested
    async setAuthorized(params) {
        const id = new soroban_client_1.Address(params.id).toScVal();
        const authorize = (0, soroban_client_1.nativeToScVal)(params.authorize, { type: 'bool' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.set_authorized,
            server: this.server,
            scVals: [id, authorize],
        });
    }
    // TODO: Needs to be tested
    async checkIfAuthorized(account) {
        const tx = new soroban_client_1.TransactionBuilder(new soroban_client_1.Account(this.globalParams.simulationAccount, '0'), {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
        })
            .addOperation(this.contract.call(interfaces_1.SorobanAssetMethods.authorized, new soroban_client_1.Address(account).toScVal()))
            .setTimeout(0)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        return (0, soroban_client_1.scValToNative)(simulated.result.retval);
    }
    async mint(params) {
        const to = new soroban_client_1.Address(params.to).toScVal();
        const amount = (0, soroban_client_1.nativeToScVal)(params.amount, { type: 'i128' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.mint,
            server: this.server,
            scVals: [to, amount],
        });
    }
    async clawback(params) {
        const from = new soroban_client_1.Address(params.from).toScVal();
        const amount = (0, soroban_client_1.nativeToScVal)(params.amount, { type: 'i128' });
        const account = await this.server.getAccount(params.sourceAccount);
        return (0, utils_1.prepareSorobanAssetTransaction)({
            sourceAccount: account,
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            timeout: params.timeout || 0,
            memo: params.memo,
            contract: this.contract,
            contractMethod: interfaces_1.SorobanAssetMethods.clawback,
            server: this.server,
            scVals: [from, amount],
        });
    }
    async bumpContractInstance(params) {
        const address = soroban_client_1.Address.fromString(this.globalParams.contractId);
        const instanceLedgerKey = soroban_client_1.xdr.LedgerKey.contractData(new soroban_client_1.xdr.LedgerKeyContractData({
            contract: address.toScAddress(),
            key: soroban_client_1.xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: soroban_client_1.xdr.ContractDataDurability.persistent(),
        }));
        const txData = new soroban_client_1.xdr.SorobanTransactionData({
            resources: new soroban_client_1.xdr.SorobanResources({
                footprint: new soroban_client_1.xdr.LedgerFootprint({
                    readOnly: [instanceLedgerKey],
                    readWrite: [],
                }),
                instructions: 0,
                readBytes: 0,
                writeBytes: 0,
            }),
            refundableFee: soroban_client_1.xdr.Int64.fromString('0'),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ext: new soroban_client_1.xdr.ExtensionPoint(0),
        });
        const source = await this.server.getAccount(params.sourceAccount);
        const tx = new soroban_client_1.TransactionBuilder(source, {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            memo: params.memo,
        })
            .setTimeout(params.timeout || 0)
            .addOperation(soroban_client_1.Operation.bumpFootprintExpiration({ ledgersToExpire: params.ledgersToExpire }))
            .setSorobanData(txData)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        const prepared = (0, soroban_client_1.assembleTransaction)(tx, this.globalParams.network, simulated).build();
        return { transactionXDR: tx.toXDR(), simulated, preparedTransactionXDR: prepared.toXDR() };
    }
    // TODO: We need to create a test for this method
    async bumpContractCode(params) {
        const instanceKey = soroban_client_1.xdr.LedgerKey.contractData(new soroban_client_1.xdr.LedgerKeyContractData({
            contract: new soroban_client_1.Address(this.globalParams.contractId).toScAddress(),
            key: soroban_client_1.xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: soroban_client_1.xdr.ContractDataDurability.persistent(),
        }));
        const response2 = await this.server.getLedgerEntries(instanceKey);
        const dataEntry = response2.entries[0].val.contractData();
        const instance = dataEntry.val().instance();
        if (!instance.executable().wasmHash()) {
            throw new Error(`There is no wasm hash. This is common if this asset is a wrapped asset.`);
        }
        const ledgerKey = soroban_client_1.xdr.LedgerKey.contractCode(new soroban_client_1.xdr.LedgerKeyContractCode({
            hash: instance.executable().wasmHash(),
        }));
        const txData = new soroban_client_1.xdr.SorobanTransactionData({
            resources: new soroban_client_1.xdr.SorobanResources({
                footprint: new soroban_client_1.xdr.LedgerFootprint({
                    readOnly: [ledgerKey],
                    readWrite: [],
                }),
                instructions: 0,
                readBytes: 0,
                writeBytes: 0,
            }),
            refundableFee: soroban_client_1.xdr.Int64.fromString('0'),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ext: new soroban_client_1.xdr.ExtensionPoint(0),
        });
        const source = await this.server.getAccount(params.sourceAccount);
        const tx = new soroban_client_1.TransactionBuilder(source, {
            fee: this.globalParams.defaultFee,
            networkPassphrase: this.globalParams.network,
            memo: params.memo,
        })
            .setTimeout(params.timeout || 0)
            .addOperation(soroban_client_1.Operation.bumpFootprintExpiration({ ledgersToExpire: params.ledgersToExpire }))
            .setSorobanData(txData)
            .build();
        const simulated = await this.server.simulateTransaction(tx);
        if (isSimulationError(simulated)) {
            throw new Error(simulated.error);
        }
        const prepared = (0, soroban_client_1.assembleTransaction)(tx, this.globalParams.network, simulated).build();
        return { transactionXDR: tx.toXDR(), simulated, preparedTransactionXDR: prepared.toXDR() };
    }
}
exports.SorobanAssetsSDK = SorobanAssetsSDK;
