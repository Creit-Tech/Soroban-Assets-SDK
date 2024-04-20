import {
  address,
  DefaultContractTransactionGenerationResponse,
  DefaultRequestParams,
  i128,
  SorobanAssetMethods,
  SorobanAssetsSDKParams,
  u32,
} from './interfaces';
import {
  Account,
  Address,
  Asset,
  Contract,
  Memo,
  nativeToScVal,
  Networks,
  Operation,
  scValToBigInt,
  scValToNative,
  SorobanRpc,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import { assembleTransaction, Server, Api } from '@stellar/stellar-sdk/lib/soroban';
import { prepareSorobanAssetTransaction } from './utils';
import isSimulationError = Api.isSimulationError;

export class SorobanAssetsSDK {
  constructor(private readonly globalParams: SorobanAssetsSDKParams) {}

  get contract(): Contract {
    return new Contract(this.globalParams.contractId);
  }

  get server(): Server {
    return this.globalParams.rpc;
  }

  public static async wrapAsset(params: {
    sourceAccount: string;
    asset: Asset;
    rpc: SorobanRpc.Server;
    network: Networks;
    timeout?: number;
    memo?: Memo;
    defaultFee?: string;
  }): Promise<DefaultContractTransactionGenerationResponse & { contractId: address }> {
    const account = await params.rpc.getAccount(params.sourceAccount);

    const tx = new TransactionBuilder(account, {
      fee: params.defaultFee || '1000000',
      networkPassphrase: params.network,
      memo: params.memo,
    })
      .setTimeout(params.timeout || 0)
      .addOperation(
        Operation.invokeHostFunction({
          func: xdr.HostFunction.hostFunctionTypeCreateContract(
            new xdr.CreateContractArgs({
              contractIdPreimage: xdr.ContractIdPreimage.contractIdPreimageFromAsset(params.asset.toXDRObject()),
              executable: xdr.ContractExecutable.contractExecutableStellarAsset(),
            })
          ),
          auth: [],
        })
      )
      .build();

    const simulated = await params.rpc.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    const prepared = assembleTransaction(tx, simulated).build();

    return {
      contractId: params.asset.contractId(params.network),
      preparedTransactionXDR: prepared.toXDR(),
      transactionXDR: tx.toXDR(),
      simulated,
    };
  }

  async getAllowance(params: { from: address; spender: address }): Promise<i128> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(
        this.contract.call(
          SorobanAssetMethods.allowance,
          new Address(params.from).toScVal(),
          new Address(params.spender).toScVal()
        )
      )
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToBigInt((simulated.result as Api.SimulateHostFunctionResult).retval);
  }

  async approve(
    params: DefaultRequestParams<{
      from: address;
      spender: address;
      amount: i128;
      expirationLedger: u32;
    }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const from: xdr.ScVal = new Address(params.from).toScVal();
    const spender: xdr.ScVal = new Address(params.spender).toScVal();
    const amount: xdr.ScVal = nativeToScVal(params.amount, { type: 'i128' });
    const expiration_ledger: xdr.ScVal = nativeToScVal(params.expirationLedger, { type: 'u32' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.approve,
      server: this.server,
      scVals: [from, spender, amount, expiration_ledger],
    });
  }

  async getBalance(account: address): Promise<i128> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(this.contract.call(SorobanAssetMethods.balance, new Address(account).toScVal()))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToBigInt((simulated.result as Api.SimulateHostFunctionResult).retval);
  }

  async transfer(
    params: DefaultRequestParams<{
      from: address;
      to: address;
      amount: i128;
    }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const from: xdr.ScVal = new Address(params.from).toScVal();
    const to: xdr.ScVal = new Address(params.to).toScVal();
    const amount: xdr.ScVal = nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.transfer,
      server: this.server,
      scVals: [from, to, amount],
    });
  }

  async transferFrom(
    params: DefaultRequestParams<{
      spender: address;
      from: address;
      to: address;
      amount: i128;
    }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const spender: xdr.ScVal = new Address(params.spender).toScVal();
    const from: xdr.ScVal = new Address(params.from).toScVal();
    const to: xdr.ScVal = new Address(params.to).toScVal();
    const amount: xdr.ScVal = nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.transfer_from,
      server: this.server,
      scVals: [spender, from, to, amount],
    });
  }

  async burn(
    params: DefaultRequestParams<{
      from: address;
      amount: i128;
    }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const from: xdr.ScVal = new Address(params.from).toScVal();
    const amount: xdr.ScVal = nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.burn,
      server: this.server,
      scVals: [from, amount],
    });
  }

  async burnFrom(
    params: DefaultRequestParams<{
      spender: address;
      from: address;
      amount: i128;
    }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const spender: xdr.ScVal = new Address(params.spender).toScVal();
    const from: xdr.ScVal = new Address(params.from).toScVal();
    const amount: xdr.ScVal = nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.burn_from,
      server: this.server,
      scVals: [spender, from, amount],
    });
  }

  async getAssetDecimals(): Promise<u32> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(this.contract.call(SorobanAssetMethods.decimals))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToNative((simulated.result as Api.SimulateHostFunctionResult).retval);
  }

  async getAssetName(): Promise<string> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(this.contract.call(SorobanAssetMethods.name))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToNative((simulated.result as Api.SimulateHostFunctionResult).retval);
  }

  async getAssetSymbol(): Promise<string> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(this.contract.call(SorobanAssetMethods.symbol))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToNative((simulated.result as Api.SimulateHostFunctionResult).retval).replace(/[^a-z0-9]/gi, '');
  }

  // TODO: Needs to be tested
  async setAdmin(
    params: DefaultRequestParams<{ newAdmin: address }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const newAdmin: xdr.ScVal = new Address(params.newAdmin).toScVal();
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.transfer_from,
      server: this.server,
      scVals: [newAdmin],
    });
  }

  // TODO: Needs to be tested
  async getAdmin(): Promise<address> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(this.contract.call(SorobanAssetMethods.admin))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToNative((simulated.result as Api.SimulateHostFunctionResult).retval);
  }

  // TODO: Needs to be tested
  async setAuthorized(
    params: DefaultRequestParams<{ id: address; authorize: boolean }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const id: xdr.ScVal = new Address(params.id).toScVal();
    const authorize: xdr.ScVal = nativeToScVal(params.authorize, { type: 'bool' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.set_authorized,
      server: this.server,
      scVals: [id, authorize],
    });
  }

  // TODO: Needs to be tested
  async checkIfAuthorized(account: address): Promise<boolean> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(this.contract.call(SorobanAssetMethods.authorized, new Address(account).toScVal()))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToNative((simulated.result as Api.SimulateHostFunctionResult).retval);
  }

  async mint(
    params: DefaultRequestParams<{ to: address; amount: i128 }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const to: xdr.ScVal = new Address(params.to).toScVal();
    const amount: xdr.ScVal = nativeToScVal(params.amount, { type: 'i128' });
    const account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.mint,
      server: this.server,
      scVals: [to, amount],
    });
  }

  async clawback(
    params: DefaultRequestParams<{ from: address; amount: i128 }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const from: xdr.ScVal = new Address(params.from).toScVal();
    const amount: xdr.ScVal = nativeToScVal(params.amount, { type: 'i128' });
    const account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sourceAccount: account,
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      timeout: params.timeout || 0,
      memo: params.memo,
      contract: this.contract,
      contractMethod: SorobanAssetMethods.clawback,
      server: this.server,
      scVals: [from, amount],
    });
  }

  async bumpContractInstance(
    params: DefaultRequestParams<{ ledgersToExpire: number }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const address = Address.fromString(this.globalParams.contractId);

    const instanceLedgerKey: xdr.LedgerKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: address.toScAddress(),
        key: xdr.ScVal.scvLedgerKeyContractInstance(),
        durability: xdr.ContractDataDurability.persistent(),
      })
    );

    const txData: xdr.SorobanTransactionData = new xdr.SorobanTransactionData({
      resourceFee: xdr.Int64.fromString('0'),
      resources: new xdr.SorobanResources({
        footprint: new xdr.LedgerFootprint({
          readOnly: [instanceLedgerKey],
          readWrite: [],
        }),
        instructions: 0,
        readBytes: 0,
        writeBytes: 0,
      }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ext: new xdr.ExtensionPoint(0),
    });

    const source: Account = await this.server.getAccount(params.sourceAccount);
    const tx: Transaction = new TransactionBuilder(source, {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      memo: params.memo,
    })
      .setTimeout(params.timeout || 0)
      .addOperation(Operation.extendFootprintTtl({ extendTo: params.ledgersToExpire }))
      .setSorobanData(txData)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    const prepared = assembleTransaction(tx, simulated).build();

    return { transactionXDR: tx.toXDR(), simulated, preparedTransactionXDR: prepared.toXDR() };
  }

  // TODO: We need to create a test for this method
  async bumpContractCode(
    params: DefaultRequestParams<{ ledgersToExpire: number }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const instanceKey: xdr.LedgerKey = xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: new Address(this.globalParams.contractId).toScAddress(),
        key: xdr.ScVal.scvLedgerKeyContractInstance(),
        durability: xdr.ContractDataDurability.persistent(),
      })
    );

    const response2: Api.GetLedgerEntriesResponse = await this.server.getLedgerEntries(instanceKey);
    const dataEntry: xdr.ContractDataEntry = response2.entries[0].val.contractData();

    const instance: xdr.ScContractInstance = dataEntry.val().instance();

    if (!instance.executable().wasmHash()) {
      throw new Error(`There is no wasm hash. This is common if this asset is a wrapped asset.`);
    }

    const ledgerKey: xdr.LedgerKey = xdr.LedgerKey.contractCode(
      new xdr.LedgerKeyContractCode({
        hash: instance.executable().wasmHash(),
      })
    );

    const txData = new xdr.SorobanTransactionData({
      resourceFee: xdr.Int64.fromString('0'),
      resources: new xdr.SorobanResources({
        footprint: new xdr.LedgerFootprint({
          readOnly: [ledgerKey],
          readWrite: [],
        }),
        instructions: 0,
        readBytes: 0,
        writeBytes: 0,
      }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ext: new xdr.ExtensionPoint(0),
    });

    const source: Account = await this.server.getAccount(params.sourceAccount);
    const tx: Transaction = new TransactionBuilder(source, {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
      memo: params.memo,
    })
      .setTimeout(params.timeout || 0)
      .addOperation(Operation.extendFootprintTtl({ extendTo: params.ledgersToExpire }))
      .setSorobanData(txData)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    const prepared = assembleTransaction(tx, simulated).build();

    return { transactionXDR: tx.toXDR(), simulated, preparedTransactionXDR: prepared.toXDR() };
  }
}
