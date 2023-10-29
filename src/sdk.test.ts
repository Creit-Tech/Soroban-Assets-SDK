import { SorobanAssetsSDK } from './sdk';
import { Account, Asset, Keypair, Networks, Server, Transaction } from 'soroban-client';
import { randomBytes } from 'node:crypto';
import * as StellarSdk from 'stellar-sdk';
import { SorobanRpc } from 'soroban-client/lib/soroban_rpc';

async function waitUntilTxApproved(server: Server, result: SorobanRpc.SendTransactionResponse) {
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

/**
 * The test of the SDK requires a local standalone network running
 * The native asset needs to be already wrapped before the tests (it shouldn't be expired)
 */
describe('SorobanAssetsSDK Tests', () => {
  const assetIssuerKeypair: Keypair = Keypair.random();
  const asset: Asset = new Asset(randomBytes(3).toString('hex'), assetIssuerKeypair.publicKey());
  const horizonUrl = 'http://localhost:8000';
  const rpcUrl = 'http://localhost:8000/soroban/rpc';
  const horizon: StellarSdk.Server = new StellarSdk.Server(horizonUrl, { allowHttp: true });
  const rpc: Server = new Server(rpcUrl, { allowHttp: true });
  const network = Networks.STANDALONE;
  const simulationAccountKeypair: Keypair = Keypair.random();
  const defaultFee = '10000000';
  const initialIssuance = '10000.0000000';

  const spenderKeypair: Keypair = Keypair.random();
  const fromKeypair: Keypair = Keypair.random();
  const toKeypair: Keypair = Keypair.random();

  const assetSDK: SorobanAssetsSDK = new SorobanAssetsSDK({
    contractId: SorobanAssetsSDK.generateStellarAssetContractId({ asset, network }),
    simulationAccount: simulationAccountKeypair.publicKey(),
    allowHttp: true,
    rpcUrl: rpcUrl,
    defaultFee,
    network,
  });

  const nativeAsset: SorobanAssetsSDK = new SorobanAssetsSDK({
    contractId: SorobanAssetsSDK.generateStellarAssetContractId({ asset: Asset.native(), network }),
    simulationAccount: simulationAccountKeypair.publicKey(),
    allowHttp: true,
    defaultFee,
    network,
    rpcUrl,
  });

  beforeAll(async () => {
    const assetIssuer: Account = await rpc.requestAirdrop(assetIssuerKeypair.publicKey());
    const { preparedTransactionXDR } = await SorobanAssetsSDK.wrapAsset({
      sourceAccount: assetIssuerKeypair.publicKey(),
      allowHttp: true,
      defaultFee,
      network,
      rpcUrl,
      asset,
    });

    const tx = new Transaction(preparedTransactionXDR, network);
    tx.sign(assetIssuerKeypair);

    const result = await rpc.sendTransaction(tx);
    await waitUntilTxApproved(rpc, result);

    await rpc.requestAirdrop(spenderKeypair.publicKey());
    await rpc.requestAirdrop(fromKeypair.publicKey());
    await rpc.requestAirdrop(toKeypair.publicKey());

    assetIssuer.incrementSequenceNumber();
    const stellarTxBuilder = new StellarSdk.TransactionBuilder(assetIssuer, {
      networkPassphrase: network,
      fee: defaultFee,
    })
      .setTimeout(0)
      .addOperation(StellarSdk.Operation.setOptions({ setFlags: StellarSdk.AuthRevocableFlag }))
      .addOperation(StellarSdk.Operation.setOptions({ setFlags: StellarSdk.AuthClawbackEnabledFlag }));

    [spenderKeypair.publicKey(), fromKeypair.publicKey(), toKeypair.publicKey()].forEach(destination => {
      stellarTxBuilder
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(asset.code, asset.issuer),
            source: destination,
          })
        )
        .addOperation(
          StellarSdk.Operation.payment({
            asset: new StellarSdk.Asset(asset.code, asset.issuer),
            amount: initialIssuance,
            destination,
          })
        );
    });

    const stellarTx = stellarTxBuilder.build();
    stellarTx.sign(StellarSdk.Keypair.fromSecret(assetIssuerKeypair.secret()));
    stellarTx.sign(StellarSdk.Keypair.fromSecret(spenderKeypair.secret()));
    stellarTx.sign(StellarSdk.Keypair.fromSecret(fromKeypair.secret()));
    stellarTx.sign(StellarSdk.Keypair.fromSecret(toKeypair.secret()));

    await horizon.submitTransaction(stellarTx);
  }, 60000);

  describe('Instance methods', () => {
    test('Check allowances and transfer/burn on behalf of other', async () => {
      const amount = 10000000n;

      const currentAllowance: bigint = await assetSDK.getAllowance({
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
      });

      expect(currentAllowance).toBe(0n);

      const latestLedger = await rpc.getLatestLedger();

      const approveTx = await assetSDK.approve({
        expirationLedger: latestLedger.sequence + 50000,
        sourceAccount: fromKeypair.publicKey(),
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
        amount,
      });

      const tx = new Transaction(approveTx.preparedTransactionXDR, network);
      tx.sign(fromKeypair);
      const result = await rpc.sendTransaction(tx);
      await waitUntilTxApproved(rpc, result);

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

      const tx2 = new Transaction(transferFromTx.preparedTransactionXDR, network);
      tx2.sign(spenderKeypair);
      const result2 = await rpc.sendTransaction(tx2);
      await waitUntilTxApproved(rpc, result2);

      const burnFromTx = await assetSDK.burnFrom({
        sourceAccount: spenderKeypair.publicKey(),
        spender: spenderKeypair.publicKey(),
        from: fromKeypair.publicKey(),
        amount: amount / 2n,
      });

      const tx3 = new Transaction(burnFromTx.preparedTransactionXDR, network);
      tx3.sign(spenderKeypair);
      const result3 = await rpc.sendTransaction(tx3);
      if (result3.status === 'ERROR') {
        console.error(result3.errorResult?.toXDR('base64'));
        throw new Error('Sending the transaction failed');
      }
      await waitUntilTxApproved(rpc, result3);

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

    test('Get account balance and spendable balance', async () => {
      const keypair: Keypair = Keypair.random();
      const account: Account = await rpc.requestAirdrop(keypair.publicKey());

      const balance: bigint = await nativeAsset.getBalance(account.accountId());
      expect(balance).toBe(100000000000n);

      const spendableBalance: bigint = await nativeAsset.getSpendableBalance(account.accountId());
      expect(spendableBalance).toBe(99990000000n);
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

      const tx = new Transaction(preparedTransactionXDR, network);
      tx.sign(fromKeypair);
      const result = await rpc.sendTransaction(tx);
      await waitUntilTxApproved(rpc, result);

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
      const mintTx = new Transaction(mintResult.preparedTransactionXDR, network);
      mintTx.sign(assetIssuerKeypair);
      const result = await rpc.sendTransaction(mintTx);
      await waitUntilTxApproved(rpc, result);

      const maxBalance: bigint = await assetSDK.getBalance(toKeypair.publicKey());

      expect(maxBalance).toBe(toBalance + amount);

      const burnResult = await assetSDK.burn({
        sourceAccount: toKeypair.publicKey(),
        from: toKeypair.publicKey(),
        amount: amount / 2n,
      });
      const burnTx = new Transaction(burnResult.preparedTransactionXDR, network);
      burnTx.sign(toKeypair);
      const result2 = await rpc.sendTransaction(burnTx);
      await waitUntilTxApproved(rpc, result2);

      const updatedAmount: bigint = await assetSDK.getBalance(toKeypair.publicKey());

      expect(updatedAmount).toBe(toBalance + amount / 2n);

      const clawbackResult = await assetSDK.clawback({
        sourceAccount: assetIssuerKeypair.publicKey(),
        from: toKeypair.publicKey(),
        amount: amount / 2n,
      });
      const clawbackTx = new Transaction(clawbackResult.preparedTransactionXDR, network);
      clawbackTx.sign(assetIssuerKeypair);
      const result3 = await rpc.sendTransaction(clawbackTx);
      await waitUntilTxApproved(rpc, result3);

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
    it('Should correctly generate the stellar asset contract id', () => {
      const nativeContractId: string = SorobanAssetsSDK.generateStellarAssetContractId({
        asset: Asset.native(),
        network,
      });

      expect(nativeContractId).toBe('CDMLFMKMMD7MWZP3FKUBZPVHTUEDLSX4BYGYKH4GCESXYHS3IHQ4EIG4');
    });

    it('Should wrap a random asset', async () => {
      const keypair: Keypair = Keypair.random();
      await rpc.requestAirdrop(keypair.publicKey());
      const assetCode: string = randomBytes(4).toString('hex').toUpperCase();

      const { preparedTransactionXDR, contractId } = await SorobanAssetsSDK.wrapAsset({
        rpcUrl,
        allowHttp: true,
        network,
        sourceAccount: keypair.publicKey(),
        asset: new Asset(assetCode, keypair.publicKey()),
      });

      const tx = new Transaction(preparedTransactionXDR, network);
      tx.sign(keypair);

      const result = await rpc.sendTransaction(tx);
      await waitUntilTxApproved(rpc, result);

      const asset: SorobanAssetsSDK = new SorobanAssetsSDK({
        contractId,
        rpcUrl: rpcUrl,
        allowHttp: true,
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
