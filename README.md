# Soroban Assets SDK

---

A Javascript/Typescript small SDK to interact with Soroban Assets.

## Installation

```shell
npm i @creit.tech/soroban-assets-sdk
```

## How to use it

The most important part of the library is the class `SorobanAssetsSDK`, we create a new instance for each asset we are interacting with like this:
```typescript
const assetSDK: SorobanAssetsSDK = new SorobanAssetsSDK({
    contractId: SorobanAssetsSDK.generateStellarAssetContractId({ asset: Asset.native(), network: Networks.STANDALONE }),
    simulationAccount: simulationAccountKeypair.publicKey(),
    allowHttp: true,
    defaultFee: '100000',
    network: Networks.STANDALONE,
    rpcUrl: 'http://localhost:8000/soroban/rpc',
});
```

Once we have an instance, we can use it to directly call the standard Soroban Assets methods (and those from classic Stellar assets too), we can do it like this:
```typescript
const { preparedTransactionXDR } = await assetSDK.transfer({
    sourceAccount: fromKeypair.publicKey(),
    from: fromKeypair.publicKey(),
    to: toKeypair.publicKey(),
    amount: 1000000000n,
});
```

Mutable functions (functions that mutate the ledger like `transfer`, `burn`, etc) will return the prepared XDR so you can sign it and send it to the network.

Meanwhile, pure-view functions like `balance` will return the value directly from the simulation. Here's an example:
```typescript
const currentBalance: bigint = await assetSDK.getBalance(toKeypair.publicKey());
currentBalance === 1000000000n // true
```

## License
![](https://img.shields.io/badge/License-MIT-lightgrey)

Licensed under the MIT License, Copyright © 2023-present Creit Technologies LLP.

Checkout the `LICENSE.md` file for more details.