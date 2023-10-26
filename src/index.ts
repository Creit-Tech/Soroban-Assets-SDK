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
  Contract,
  nativeToScVal,
  scValToBigInt,
  scValToNative,
  Server,
  SorobanRpc,
  TransactionBuilder,
  xdr,
} from 'soroban-client';
import { prepareSorobanAssetTransaction } from './utils';
import isSimulationError = SorobanRpc.isSimulationError;

export * from './interfaces';

export class SorobanAssetsSDK {
  constructor(private readonly globalParams: SorobanAssetsSDKParams) {}

  get contract(): Contract {
    return new Contract(this.globalParams.contractId);
  }

  get server(): Server {
    return new Server(this.globalParams.rpc, { allowHttp: !!this.globalParams.allowHttp });
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

    return scValToBigInt((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
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
    const expiration_ledger: xdr.ScVal = nativeToScVal(params.amount, { type: 'u32' });
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

    return scValToBigInt((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
  }

  async getSpendableBalance(account: address): Promise<i128> {
    const tx = new TransactionBuilder(new Account(this.globalParams.simulationAccount, '0'), {
      fee: this.globalParams.defaultFee,
      networkPassphrase: this.globalParams.network,
    })
      .addOperation(this.contract.call(SorobanAssetMethods.spendable_balance, new Address(account).toScVal()))
      .setTimeout(0)
      .build();

    const simulated = await this.server.simulateTransaction(tx);

    if (isSimulationError(simulated)) {
      throw new Error(simulated.error);
    }

    return scValToBigInt((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
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
    const spender: xdr.ScVal = new Address(params.from).toScVal();
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

    return scValToNative((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
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

    return scValToNative((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
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

    return scValToNative((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
  }

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

    return scValToNative((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
  }

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

    return scValToNative((simulated.result as SorobanRpc.SimulateHostFunctionResult).retval);
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
}
