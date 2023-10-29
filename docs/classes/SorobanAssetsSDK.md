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

[sdk.ts:34](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L34)

## Properties

### globalParams

• `Private` `Readonly` **globalParams**: [`SorobanAssetsSDKParams`](../interfaces/SorobanAssetsSDKParams.md)

#### Defined in

[sdk.ts:34](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L34)

## Accessors

### contract

• `get` **contract**(): `Contract`

#### Returns

`Contract`

#### Defined in

[sdk.ts:36](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L36)

___

### server

• `get` **server**(): `Server`

#### Returns

`Server`

#### Defined in

[sdk.ts:40](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L40)

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

[sdk.ts:127](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L127)

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

[sdk.ts:242](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L242)

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

[sdk.ts:265](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L265)

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

[sdk.ts:405](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L405)

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

[sdk.ts:443](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L443)

___

### getAdmin

▸ **getAdmin**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:365](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L365)

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

[sdk.ts:103](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L103)

___

### getAssetDecimals

▸ **getAssetDecimals**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[sdk.ts:290](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L290)

___

### getAssetName

▸ **getAssetName**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:308](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L308)

___

### getAssetSymbol

▸ **getAssetSymbol**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[sdk.ts:326](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L326)

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

[sdk.ts:154](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L154)

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

[sdk.ts:172](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L172)

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

[sdk.ts:423](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L423)

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

[sdk.ts:345](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L345)

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

[sdk.ts:384](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L384)

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

[sdk.ts:190](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L190)

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

[sdk.ts:215](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L215)

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

[sdk.ts:44](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L44)

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

[sdk.ts:55](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/sdk.ts#L55)
