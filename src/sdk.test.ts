import { SorobanAssetsSDK } from './sdk';
import {
  Account,
  Address,
  Asset,
  AuthClawbackEnabledFlag,
  AuthRevocableFlag,
  Contract,
  Horizon,
  Keypair,
  nativeToScVal,
  Networks,
  Operation,
  rpc,
  scValToBigInt,
  scValToNative,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import { randomBytes } from 'node:crypto';

async function waitUntilTxApproved(server: rpc.Server, result: rpc.Api.SendTransactionResponse) {
  if (result.status === 'ERROR') {
    console.error(result.errorResult?.toXDR('base64'));
    throw new Error('Sending the transaction failed');
  }

  const { hash } = result;

  let completed = false;
  while (!completed) {
    const tx = await server.getTransaction(hash);

    if (tx.status === 'NOT_FOUND') {
      await new Promise(r => setTimeout(r, 1000));
    } else if (tx.status === 'SUCCESS') {
      completed = true;
    } else {
      throw new Error(`Transaction ${hash} failed.`);
    }
  }
}

async function getExpirationLedger(server: rpc.Server, ledgerKey: xdr.LedgerKey) {
  const data: rpc.Api.GetLedgerEntriesResponse = await server.getLedgerEntries(ledgerKey);

  if (!data.entries) {
    throw new Error(`Entry doesn't exist`);
  }

  return data.entries[0].liveUntilLedgerSeq;
}

/**
 * The test of the SDK requires a local standalone network running
 * The native asset needs to be already wrapped before the tests (it shouldn't be expired)
 */
describe('SorobanAssetsSDK Tests', () => {
  const assetIssuerKeypair: Keypair = Keypair.random();
  const asset: Asset = new Asset(randomBytes(3).toString('hex'), assetIssuerKeypair.publicKey());
  const horizonUrl = 'https://horizon-testnet.stellar.org';
  const rpcUrl = 'https://soroban-testnet.stellar.org';
  const horizon: Horizon.Server = new Horizon.Server(horizonUrl);
  const rpcServer: rpc.Server = new rpc.Server(rpcUrl);
  const network = Networks.TESTNET;
  const simulationAccountKeypair: Keypair = Keypair.random();
  const defaultFee = '10000000';
  const initialIssuance = '10000.0000000';

  const spenderKeypair: Keypair = Keypair.random();
  const fromKeypair: Keypair = Keypair.random();
  const toKeypair: Keypair = Keypair.random();

  const assetSDK: SorobanAssetsSDK = new SorobanAssetsSDK({
    stellarSDK: {
      Account,
      Address,
      Contract,
      xdr,
      TransactionBuilder,
      rpc,
      nativeToScVal,
      scValToNative,
      scValToBigInt,
      Operation,
    },
    contractId: asset.contractId(network),
    simulationAccount: simulationAccountKeypair.publicKey(),
    defaultFee,
    network,
    rpc: rpcServer,
  });

  const nativeAsset: SorobanAssetsSDK = new SorobanAssetsSDK({
    stellarSDK: {
      Account,
      Address,
      Contract,
      xdr,
      TransactionBuilder,
      rpc,
      nativeToScVal,
      scValToNative,
      scValToBigInt,
      Operation,
    },
    contractId: Asset.native().contractId(network),
    simulationAccount: simulationAccountKeypair.publicKey(),
    defaultFee,
    network,
    rpc: rpcServer,
  });

  beforeAll(async () => {
    await horizon.friendbot(assetIssuerKeypair.publicKey()).call();
    const assetIssuer: Account = await rpcServer.getAccount(assetIssuerKeypair.publicKey());
    const { preparedTransactionXDR } = await SorobanAssetsSDK.wrapAsset({
      sdk: {
        Account,
        Address,
        Contract,
        xdr,
        TransactionBuilder,
        rpc,
        nativeToScVal,
        scValToNative,
        scValToBigInt,
        Operation,
      },
      sourceAccount: assetIssuerKeypair.publicKey(),
      defaultFee,
      network,
      asset,
      rpc: rpcServer,
    });

    const tx = await rpcServer.prepareTransaction(new Transaction(preparedTransactionXDR, network));
    tx.sign(assetIssuerKeypair);

    const result = await rpcServer.sendTransaction(tx);
    await waitUntilTxApproved(rpcServer, result);

    await horizon.friendbot(spenderKeypair.publicKey()).call();
    await horizon.friendbot(fromKeypair.publicKey()).call();
    await horizon.friendbot(toKeypair.publicKey()).call();

    assetIssuer.incrementSequenceNumber();
    const stellarTxBuilder = new TransactionBuilder(assetIssuer, {
      networkPassphrase: network,
      fee: defaultFee,
    })
      .setTimeout(0)
      .addOperation(Operation.setOptions({ setFlags: AuthRevocableFlag }))
      .addOperation(Operation.setOptions({ setFlags: AuthClawbackEnabledFlag }));

    [spenderKeypair.publicKey(), fromKeypair.publicKey(), toKeypair.publicKey()].forEach(destination => {
      stellarTxBuilder
        .addOperation(
          Operation.changeTrust({
            asset: new Asset(asset.code, asset.issuer),
            source: destination,
          })
        )
        .addOperation(
          Operation.payment({
            asset: new Asset(asset.code, asset.issuer),
            amount: initialIssuance,
            destination,
          })
        );
    });

    const stellarTx = stellarTxBuilder.build();
    stellarTx.sign(Keypair.fromSecret(assetIssuerKeypair.secret()));
    stellarTx.sign(Keypair.fromSecret(spenderKeypair.secret()));
    stellarTx.sign(Keypair.fromSecret(fromKeypair.secret()));
    stellarTx.sign(Keypair.fromSecret(toKeypair.secret()));

    try {
      await horizon.submitTransaction(stellarTx);
    } catch (e) {
      throw e;
    }
  }, 60000);

  describe('Instance methods', () => {
    test('Check allowances and transfer/burn on behalf of other', async () => {
      const amount = 10000000n;

      const currentAllowance: bigint = await assetSDK.getAllowance({
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
      });

      expect(currentAllowance).toBe(0n);

      const latestLedger = await rpcServer.getLatestLedger();

      const approveTx = await assetSDK.approve({
        expirationLedger: latestLedger.sequence + 50000,
        sourceAccount: fromKeypair.publicKey(),
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
        amount,
      });

      const tx = await rpcServer.prepareTransaction(new Transaction(approveTx.preparedTransactionXDR, network));
      tx.sign(fromKeypair);
      const result = await rpcServer.sendTransaction(tx);
      await waitUntilTxApproved(rpcServer, result);

      const updatedAllowance: bigint = await assetSDK.getAllowance({
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
      });

      expect(updatedAllowance).toBe(amount);

      const [fromBalance, toBalance] = await Promise.all([
        assetSDK.getBalance(fromKeypair.publicKey()),
        assetSDK.getBalance(toKeypair.publicKey()),
      ]);

      const transferFromTx = await assetSDK.transferFrom({
        sourceAccount: spenderKeypair.publicKey(),
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
        to: toKeypair.publicKey(),
        amount: amount / 2n,
      });

      const tx2 = await rpcServer.prepareTransaction(new Transaction(transferFromTx.preparedTransactionXDR, network));
      tx2.sign(spenderKeypair);
      const result2 = await rpcServer.sendTransaction(tx2);
      await waitUntilTxApproved(rpcServer, result2);

      const burnFromTx = await assetSDK.burnFrom({
        sourceAccount: spenderKeypair.publicKey(),
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
        amount: amount / 2n,
      });

      const tx3 = await rpcServer.prepareTransaction(new Transaction(burnFromTx.preparedTransactionXDR, network));
      tx3.sign(spenderKeypair);
      const result3 = await rpcServer.sendTransaction(tx3);
      if (result3.status === 'ERROR') {
        console.error(result3.errorResult?.toXDR('base64'));
        throw new Error('Sending the transaction failed');
      }
      await waitUntilTxApproved(rpcServer, result3);

      const [updatedFromBalance, updatedToBalance] = await Promise.all([
        assetSDK.getBalance(fromKeypair.publicKey()),
        assetSDK.getBalance(toKeypair.publicKey()),
      ]);

      const remainingAllowance: bigint = await assetSDK.getAllowance({
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
      });

      expect(remainingAllowance).toBe(0n);

      expect(updatedFromBalance).toBe(fromBalance - amount);
      expect(updatedToBalance).toBe(toBalance + amount / 2n);
    }, 20000);

    test('Transfer funds between accounts', async () => {
      const amount = 10000000n;

      const [fromBalance, toBalance] = await Promise.all([
        assetSDK.getBalance(fromKeypair.publicKey()),
        assetSDK.getBalance(toKeypair.publicKey()),
      ]);

      const { preparedTransactionXDR } = await assetSDK.transfer({
        sourceAccount: fromKeypair.publicKey(),
        from: fromKeypair.publicKey(),
        to: toKeypair.publicKey(),
        amount,
      });

      const tx = await rpcServer.prepareTransaction(new Transaction(preparedTransactionXDR, network));
      tx.sign(fromKeypair);
      const result = await rpcServer.sendTransaction(tx);
      await waitUntilTxApproved(rpcServer, result);

      const [updatedFromBalance, updatedToBalance] = await Promise.all([
        assetSDK.getBalance(fromKeypair.publicKey()),
        assetSDK.getBalance(toKeypair.publicKey()),
      ]);

      expect(updatedFromBalance).toBe(fromBalance - amount);
      expect(updatedToBalance).toBe(toBalance + amount);
    }, 20000);

    test('Mint, clawback and burn balance', async () => {
      const amount = 10000000n;

      const toBalance: bigint = await assetSDK.getBalance(toKeypair.publicKey());

      const mintResult = await assetSDK.mint({
        sourceAccount: assetIssuerKeypair.publicKey(),
        to: toKeypair.publicKey(),
        amount,
      });
      const mintTx = await rpcServer.prepareTransaction(new Transaction(mintResult.preparedTransactionXDR, network));
      mintTx.sign(assetIssuerKeypair);
      const result = await rpcServer.sendTransaction(mintTx);
      await waitUntilTxApproved(rpcServer, result);

      const maxBalance: bigint = await assetSDK.getBalance(toKeypair.publicKey());

      expect(maxBalance).toBe(toBalance + amount);

      const burnResult = await assetSDK.burn({
        sourceAccount: toKeypair.publicKey(),
        from: toKeypair.publicKey(),
        amount: amount / 2n,
      });
      const burnTx = await rpcServer.prepareTransaction(new Transaction(burnResult.preparedTransactionXDR, network));
      burnTx.sign(toKeypair);
      const result2 = await rpcServer.sendTransaction(burnTx);
      await waitUntilTxApproved(rpcServer, result2);

      const updatedAmount: bigint = await assetSDK.getBalance(toKeypair.publicKey());

      expect(updatedAmount).toBe(toBalance + amount / 2n);

      const clawbackResult = await assetSDK.clawback({
        sourceAccount: assetIssuerKeypair.publicKey(),
        from: toKeypair.publicKey(),
        amount: amount / 2n,
      });
      const clawbackTx = await rpcServer.prepareTransaction(
        new Transaction(clawbackResult.preparedTransactionXDR, network)
      );
      clawbackTx.sign(assetIssuerKeypair);
      const result3 = await rpcServer.sendTransaction(clawbackTx);
      await waitUntilTxApproved(rpcServer, result3);

      const finalAmount: bigint = await assetSDK.getBalance(toKeypair.publicKey());

      expect(finalAmount).toBe(toBalance);
    }, 20000);

    test('Asset decimals, name and symbol', async () => {
      const [decimals, name, symbol] = await Promise.all([
        nativeAsset.getAssetDecimals(),
        nativeAsset.getAssetName(),
        nativeAsset.getAssetSymbol(),
      ]);

      expect(decimals).toEqual(7);
      expect(name).toEqual('native');
      expect(symbol).toEqual('native');
    }, 20000);
  });

  describe('Static methods', () => {
    it('Should wrap a random asset', async () => {
      const keypair: Keypair = Keypair.random();
      await horizon.friendbot(keypair.publicKey()).call();
      const assetCode: string = randomBytes(4).toString('hex').toUpperCase();

      const { preparedTransactionXDR, contractId } = await SorobanAssetsSDK.wrapAsset({
        sdk: {
          Account,
          Address,
          Contract,
          xdr,
          TransactionBuilder,
          rpc,
          nativeToScVal,
          scValToNative,
          scValToBigInt,
          Operation,
        },
        rpc: rpcServer,
        network,
        sourceAccount: keypair.publicKey(),
        asset: new Asset(assetCode, keypair.publicKey()),
      });

      const tx = await rpcServer.prepareTransaction(new Transaction(preparedTransactionXDR, network));
      tx.sign(keypair);

      const result = await rpcServer.sendTransaction(tx);
      await waitUntilTxApproved(rpcServer, result);

      const asset: SorobanAssetsSDK = new SorobanAssetsSDK({
        stellarSDK: {
          Account,
          Address,
          Contract,
          xdr,
          TransactionBuilder,
          rpc,
          nativeToScVal,
          scValToNative,
          scValToBigInt,
          Operation,
        },
        contractId,
        rpc: rpcServer,
        defaultFee,
        network,
        simulationAccount: keypair.publicKey(),
      });

      const [name, symbol, decimals] = await Promise.all([
        asset.getAssetName(),
        asset.getAssetSymbol(),
        asset.getAssetDecimals(),
      ]);

      expect(name).toBe(`${assetCode}:${keypair.publicKey()}`);
      expect(symbol).toBe(assetCode);
      expect(decimals).toBe(7);
    }, 10000);
  });
});
