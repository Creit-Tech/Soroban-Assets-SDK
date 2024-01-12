[@creit-tech/soroban-assets-sdk](../README.md) / [Exports](../modules.md) / SorobanAssetsSDKParams

# Interface: SorobanAssetsSDKParams

## Table of contents

### Properties

- [allowHttp](SorobanAssetsSDKParams.md#allowhttp)
- [contractId](SorobanAssetsSDKParams.md#contractid)
- [defaultFee](SorobanAssetsSDKParams.md#defaultfee)
- [network](SorobanAssetsSDKParams.md#network)
- [rpcUrl](SorobanAssetsSDKParams.md#rpcurl)
- [simulationAccount](SorobanAssetsSDKParams.md#simulationaccount)

## Properties

### allowHttp

• `Optional` **allowHttp**: `boolean`

#### Defined in

[interfaces.ts:61](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L61)

___

### contractId

• **contractId**: `string`

#### Defined in

[interfaces.ts:58](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L58)

___

### defaultFee

• **defaultFee**: `string`

#### Defined in

[interfaces.ts:59](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L59)

___

### network

• **network**: `Networks`

#### Defined in

[interfaces.ts:62](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L62)

___

### rpcUrl

• **rpcUrl**: `string`

#### Defined in

[interfaces.ts:60](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L60)

___

### simulationAccount

• **simulationAccount**: `string`

The simulation account is the one used for pure view (read-only) methods like `balance`, `symbol`, etc
You don't need to own this account, but it must be an existing account on the network

#### Defined in

[interfaces.ts:57](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L57)
