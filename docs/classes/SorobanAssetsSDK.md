[soroban-assets-sdk-js](../README.md) / [Exports](../modules.md) / SorobanAssetsSDK

# Class: SorobanAssetsSDK

## Table of contents

### Constructors

- [constructor](SorobanAssetsSDK.md#constructor)

### Properties

- [globalParams](SorobanAssetsSDK.md#globalparams)

### Accessors

- [contract](SorobanAssetsSDK.md#contract)
- [server](SorobanAssetsSDK.md#server)

### Methods

- [approve](SorobanAssetsSDK.md#approve)
- [bumpContractCode](SorobanAssetsSDK.md#bumpcontractcode)
- [bumpContractInstance](SorobanAssetsSDK.md#bumpcontractinstance)
- [burn](SorobanAssetsSDK.md#burn)
- [burnFrom](SorobanAssetsSDK.md#burnfrom)
- [checkIfAuthorized](SorobanAssetsSDK.md#checkifauthorized)
- [clawback](SorobanAssetsSDK.md#clawback)
- [getAdmin](SorobanAssetsSDK.md#getadmin)
- [getAllowance](SorobanAssetsSDK.md#getallowance)
- [getAssetDecimals](SorobanAssetsSDK.md#getassetdecimals)
- [getAssetName](SorobanAssetsSDK.md#getassetname)
- [getAssetSymbol](SorobanAssetsSDK.md#getassetsymbol)
- [getBalance](SorobanAssetsSDK.md#getbalance)
- [getSpendableBalance](SorobanAssetsSDK.md#getspendablebalance)
- [mint](SorobanAssetsSDK.md#mint)
- [setAdmin](SorobanAssetsSDK.md#setadmin)
- [setAuthorized](SorobanAssetsSDK.md#setauthorized)
- [transfer](SorobanAssetsSDK.md#transfer)
- [transferFrom](SorobanAssetsSDK.md#transferfrom)
- [generateStellarAssetContractId](SorobanAssetsSDK.md#generatestellarassetcontractid)
- [wrapAsset](SorobanAssetsSDK.md#wrapasset)

## Constructors

### constructor

• **new SorobanAssetsSDK**(`globalParams`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `globalParams` | [`SorobanAssetsSDKParams`](../interfaces/SorobanAssetsSDKParams.md) |

#### Defined in

[sdk.ts:35](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L35)

## Properties

### globalParams

• `Private` `Readonly` **globalParams**: [`SorobanAssetsSDKParams`](../interfaces/SorobanAssetsSDKParams.md)

#### Defined in

[sdk.ts:35](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L35)

## Accessors

### contract

• `get` **contract**(): `Contract`

#### Returns

`Contract`

#### Defined in

[sdk.ts:37](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L37)

___

### server

• `get` **server**(): `Server`

#### Returns

`Server`

#### Defined in

[sdk.ts:41](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L41)

## Methods

### approve

▸ **approve**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `amount`: `bigint` ; `expirationLedger`: `number` ; `from`: `string` ; `spender`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:128](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L128)

___

### bumpContractCode

▸ **bumpContractCode**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `ledgersToExpire`: `number`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:516](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L516)

___

### bumpContractInstance

▸ **bumpContractInstance**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `ledgersToExpire`: `number`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:464](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L464)

___

### burn

▸ **burn**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `amount`: `bigint` ; `from`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:243](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L243)

___

### burnFrom

▸ **burnFrom**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `amount`: `bigint` ; `from`: `string` ; `spender`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:266](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L266)

___

### checkIfAuthorized

▸ **checkIfAuthorized**(`account`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[sdk.ts:406](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L406)

___

### clawback

▸ **clawback**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `amount`: `bigint` ; `from`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:444](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L444)

___

### getAdmin

▸ **getAdmin**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:366](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L366)

___

### getAllowance

▸ **getAllowance**(`params`): `Promise`<`bigint`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.from` | `string` |
| `params.spender` | `string` |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[sdk.ts:104](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L104)

___

### getAssetDecimals

▸ **getAssetDecimals**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[sdk.ts:291](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L291)

___

### getAssetName

▸ **getAssetName**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:309](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L309)

___

### getAssetSymbol

▸ **getAssetSymbol**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:327](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L327)

___

### getBalance

▸ **getBalance**(`account`): `Promise`<`bigint`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[sdk.ts:155](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L155)

___

### getSpendableBalance

▸ **getSpendableBalance**(`account`): `Promise`<`bigint`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `string` |

#### Returns

`Promise`<`bigint`\>

#### Defined in

[sdk.ts:173](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L173)

___

### mint

▸ **mint**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `amount`: `bigint` ; `to`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:424](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L424)

___

### setAdmin

▸ **setAdmin**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `newAdmin`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:346](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L346)

___

### setAuthorized

▸ **setAuthorized**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `authorize`: `boolean` ; `id`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:385](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L385)

___

### transfer

▸ **transfer**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `amount`: `bigint` ; `from`: `string` ; `to`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:191](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L191)

___

### transferFrom

▸ **transferFrom**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`DefaultRequestParams`](../modules.md#defaultrequestparams)<{ `amount`: `bigint` ; `from`: `string` ; `spender`: `string` ; `to`: `string`  }\> |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md)\>

#### Defined in

[sdk.ts:216](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L216)

___

### generateStellarAssetContractId

▸ `Static` **generateStellarAssetContractId**(`params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.asset` | `Asset` |
| `params.network` | `Networks` |

#### Returns

`string`

#### Defined in

[sdk.ts:45](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L45)

___

### wrapAsset

▸ `Static` **wrapAsset**(`params`): `Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md) & { `contractId`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.allowHttp?` | `boolean` |
| `params.asset` | `Asset` |
| `params.defaultFee?` | `string` |
| `params.memo?` | `Memo`<`MemoType`\> |
| `params.network` | `Networks` |
| `params.rpcUrl` | `string` |
| `params.sourceAccount` | `string` |
| `params.timeout?` | `number` |

#### Returns

`Promise`<[`DefaultContractTransactionGenerationResponse`](../interfaces/DefaultContractTransactionGenerationResponse.md) & { `contractId`: `string`  }\>

#### Defined in

[sdk.ts:56](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/b2aa3b4/src/sdk.ts#L56)
