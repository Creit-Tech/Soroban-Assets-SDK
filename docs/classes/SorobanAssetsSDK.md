[@creit-tech/soroban-assets-sdk](../README.md) / [Exports](../modules.md) / SorobanAssetsSDK

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

[sdk.ts:32](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L32)

## Properties

### globalParams

• `Private` `Readonly` **globalParams**: [`SorobanAssetsSDKParams`](../interfaces/SorobanAssetsSDKParams.md)

#### Defined in

[sdk.ts:32](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L32)

## Accessors

### contract

• `get` **contract**(): `Contract`

#### Returns

`Contract`

#### Defined in

[sdk.ts:34](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L34)

___

### server

• `get` **server**(): `Server`

#### Returns

`Server`

#### Defined in

[sdk.ts:38](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L38)

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

[sdk.ts:125](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L125)

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

[sdk.ts:495](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L495)

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

[sdk.ts:443](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L443)

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

[sdk.ts:222](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L222)

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

[sdk.ts:245](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L245)

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

[sdk.ts:385](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L385)

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

[sdk.ts:423](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L423)

___

### getAdmin

▸ **getAdmin**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:345](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L345)

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

[sdk.ts:101](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L101)

___

### getAssetDecimals

▸ **getAssetDecimals**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[sdk.ts:270](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L270)

___

### getAssetName

▸ **getAssetName**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:288](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L288)

___

### getAssetSymbol

▸ **getAssetSymbol**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:306](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L306)

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

[sdk.ts:152](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L152)

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

[sdk.ts:403](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L403)

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

[sdk.ts:325](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L325)

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

[sdk.ts:364](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L364)

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

[sdk.ts:170](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L170)

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

[sdk.ts:195](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L195)

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

[sdk.ts:42](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L42)

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

[sdk.ts:53](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/sdk.ts#L53)
