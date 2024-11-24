import {
  address,
  DefaultContractTransactionGenerationResponse,
  DefaultRequestParams,
  i128,
  SorobanAssetMethods,
  SorobanAssetsSDKParams,
  u32,
} from './interfaces';
import { prepareSorobanAssetTransaction } from './utils';
import { Account, Asset, Contract, Memo, Networks, rpc, xdr } from '@stellar/stellar-sdk';

export class SorobanAssetsSDK {
  constructor(public globalParams: SorobanAssetsSDKParams) {}

  get contract(): Contract {
    return new this.globalParams.stellarSDK.Contract(this.globalParams.contractId);
  }

  get server(): rpc.Server {
    return this.globalParams.rpc;
  }

  public static async wrapAsset(params: {
    sdk: SorobanAssetsSDKParams['stellarSDK'];
    sourceAccount: string;
    asset: Asset;
    rpc: rpc.Server;
    network: Networks;
    timeout?: number;
    memo?: Memo;
    defaultFee?: string;
  }): Promise<DefaultContractTransactionGenerationResponse & { contractId: address }> {
    const account = await params.rpc.getAccount(params.sourceAccount);

    const tx = new params.sdk.TransactionBuilder(account, {
      fee: params.defaultFee || '1000000',
      networkPassphrase: params.network,
      memo: params.memo,
    })
      .setTimeout(params.timeout || 0)
      .addOperation(
        params.sdk.Operation.invokeHostFunction({
          func: params.sdk.xdr.HostFunction.hostFunctionTypeCreateContract(
            new params.sdk.xdr.CreateContractArgs({
              contractIdPreimage: params.sdk.xdr.ContractIdPreimage.contractIdPreimageFromAsset(
                params.asset.toXDRObject()
              ),
              executable: params.sdk.xdr.ContractExecutable.contractExecutableStellarAsset(),
            })
          ),
          auth: [],
        })
      )
      .build();

    const simulated = await params.rpc.simulateTransaction(tx);

    if (params.sdk.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    const prepared = params.sdk.rpc.assembleTransaction(tx, simulated).build();

    return {
      contractId: params.asset.contractId(params.network),
      preparedTransactionXDR: prepared.toXDR(),
      transactionXDR: tx.toXDR(),
      simulated,
    };
  }

  async getAllowance(params: { from: address; spender: address }): Promise<i128> {
    const tx = new this.globalParams.stellarSDK.TransactionBuilder(
      new this.globalParams.stellarSDK.Account(this.globalParams.simulationAccount, '0'),
      {
        fee: this.globalParams.defaultFee,
        networkPassphrase: this.globalParams.network,
      }
    )
      .addOperation(
        this.contract.call(
          SorobanAssetMethods.allowance,
          new this.globalParams.stellarSDK.Address(params.from).toScVal(),
          new this.globalParams.stellarSDK.Address(params.spender).toScVal()
        )
      )
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (this.globalParams.stellarSDK.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return this.globalParams.stellarSDK.scValToBigInt((simulated.result as rpc.Api.SimulateHostFunctionResult).retval);
  }

  async approve(
    params: DefaultRequestParams<{
      from: address;
      spender: address;
      amount: i128;
      expirationLedger: u32;
    }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const from: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.from).toScVal();
    const spender: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.spender).toScVal();
    const amount: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.amount, { type: 'i128' });
    const expiration_ledger: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.expirationLedger, {
      type: 'u32',
    });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const tx = new this.globalParams.stellarSDK.TransactionBuilder(
      new this.globalParams.stellarSDK.Account(this.globalParams.simulationAccount, '0'),
      {
        fee: this.globalParams.defaultFee,
        networkPassphrase: this.globalParams.network,
      }
    )
      .addOperation(
        this.contract.call(SorobanAssetMethods.balance, new this.globalParams.stellarSDK.Address(account).toScVal())
      )
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (this.globalParams.stellarSDK.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return this.globalParams.stellarSDK.scValToBigInt((simulated.result as rpc.Api.SimulateHostFunctionResult).retval);
  }

  async transfer(
    params: DefaultRequestParams<{
      from: address;
      to: address;
      amount: i128;
    }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const from: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.from).toScVal();
    const to: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.to).toScVal();
    const amount: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const spender: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.spender).toScVal();
    const from: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.from).toScVal();
    const to: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.to).toScVal();
    const amount: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const from: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.from).toScVal();
    const amount: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const spender: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.spender).toScVal();
    const from: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.from).toScVal();
    const amount: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.amount, { type: 'i128' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const tx = new this.globalParams.stellarSDK.TransactionBuilder(
      new this.globalParams.stellarSDK.Account(this.globalParams.simulationAccount, '0'),
      {
        fee: this.globalParams.defaultFee,
        networkPassphrase: this.globalParams.network,
      }
    )
      .addOperation(this.contract.call(SorobanAssetMethods.decimals))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (this.globalParams.stellarSDK.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return this.globalParams.stellarSDK.scValToNative((simulated.result as rpc.Api.SimulateHostFunctionResult).retval);
  }

  async getAssetName(): Promise<string> {
    const tx = new this.globalParams.stellarSDK.TransactionBuilder(
      new this.globalParams.stellarSDK.Account(this.globalParams.simulationAccount, '0'),
      {
        fee: this.globalParams.defaultFee,
        networkPassphrase: this.globalParams.network,
      }
    )
      .addOperation(this.contract.call(SorobanAssetMethods.name))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (this.globalParams.stellarSDK.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return this.globalParams.stellarSDK.scValToNative((simulated.result as rpc.Api.SimulateHostFunctionResult).retval);
  }

  async getAssetSymbol(): Promise<string> {
    const tx = new this.globalParams.stellarSDK.TransactionBuilder(
      new this.globalParams.stellarSDK.Account(this.globalParams.simulationAccount, '0'),
      {
        fee: this.globalParams.defaultFee,
        networkPassphrase: this.globalParams.network,
      }
    )
      .addOperation(this.contract.call(SorobanAssetMethods.symbol))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (this.globalParams.stellarSDK.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return this.globalParams.stellarSDK
      .scValToNative((simulated.result as rpc.Api.SimulateHostFunctionResult).retval)
      .replace(/[^a-z0-9]/gi, '');
  }

  // TODO: Needs to be tested
  async setAdmin(
    params: DefaultRequestParams<{ newAdmin: address }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const newAdmin: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.newAdmin).toScVal();
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const tx = new this.globalParams.stellarSDK.TransactionBuilder(
      new this.globalParams.stellarSDK.Account(this.globalParams.simulationAccount, '0'),
      {
        fee: this.globalParams.defaultFee,
        networkPassphrase: this.globalParams.network,
      }
    )
      .addOperation(this.contract.call(SorobanAssetMethods.admin))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (this.globalParams.stellarSDK.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return this.globalParams.stellarSDK.scValToNative((simulated.result as rpc.Api.SimulateHostFunctionResult).retval);
  }

  // TODO: Needs to be tested
  async setAuthorized(
    params: DefaultRequestParams<{ id: address; authorize: boolean }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const id: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.id).toScVal();
    const authorize: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.authorize, { type: 'bool' });
    const account: Account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const tx = new this.globalParams.stellarSDK.TransactionBuilder(
      new this.globalParams.stellarSDK.Account(this.globalParams.simulationAccount, '0'),
      {
        fee: this.globalParams.defaultFee,
        networkPassphrase: this.globalParams.network,
      }
    )
      .addOperation(
        this.contract.call(SorobanAssetMethods.authorized, new this.globalParams.stellarSDK.Address(account).toScVal())
      )
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (this.globalParams.stellarSDK.rpc.Api.isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return this.globalParams.stellarSDK.scValToNative((simulated.result as rpc.Api.SimulateHostFunctionResult).retval);
  }

  async mint(
    params: DefaultRequestParams<{ to: address; amount: i128 }>
  ): Promise<DefaultContractTransactionGenerationResponse> {
    const to: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.to).toScVal();
    const amount: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.amount, { type: 'i128' });
    const account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
    const from: xdr.ScVal = new this.globalParams.stellarSDK.Address(params.from).toScVal();
    const amount: xdr.ScVal = this.globalParams.stellarSDK.nativeToScVal(params.amount, { type: 'i128' });
    const account = await this.server.getAccount(params.sourceAccount);

    return prepareSorobanAssetTransaction({
      sdk: this.globalParams.stellarSDK,
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
}
