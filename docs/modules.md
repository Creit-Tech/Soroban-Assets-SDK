[soroban-assets-sdk-js](README.md) / Exports

# soroban-assets-sdk-js

## Table of contents

### Enumerations

- [SorobanAssetMethods](enums/SorobanAssetMethods.md)

### Classes

- [SorobanAssetsSDK](classes/SorobanAssetsSDK.md)

### Interfaces

- [AllowanceDataKey](interfaces/AllowanceDataKey.md)
- [AllowanceValue](interfaces/AllowanceValue.md)
- [BalanceValue](interfaces/BalanceValue.md)
- [DefaultContractTransactionGenerationResponse](interfaces/DefaultContractTransactionGenerationResponse.md)
- [SorobanAssetsSDKParams](interfaces/SorobanAssetsSDKParams.md)

### Type Aliases

- [DataKey](modules.md#datakey)
- [DefaultCallParams](modules.md#defaultcallparams)
- [DefaultRequestParams](modules.md#defaultrequestparams)
- [InstanceDataKey](modules.md#instancedatakey)
- [address](modules.md#address)
- [i128](modules.md#i128)
- [u32](modules.md#u32)

## Type Aliases

### DataKey

Ƭ **DataKey**: [``"Allowance"``, [`AllowanceDataKey`](interfaces/AllowanceDataKey.md)] \| [``"Balance"``, [`address`](modules.md#address)]

#### Defined in

[interfaces.ts:23](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/interfaces.ts#L23)

___

### DefaultCallParams

Ƭ **DefaultCallParams**<`T`\>: `T` & { `fee?`: `string` ; `memo?`: `Memo`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[interfaces.ts:26](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/interfaces.ts#L26)

___

### DefaultRequestParams

Ƭ **DefaultRequestParams**<`T`\>: `T` & { `memo?`: `Memo` ; `sourceAccount`: [`address`](modules.md#address) ; `timeout?`: `number`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[interfaces.ts:64](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/interfaces.ts#L64)

___

### InstanceDataKey

Ƭ **InstanceDataKey**: [``"Admin"``] \| [``"AssetInfo"``]

#### Defined in

[interfaces.ts:24](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/interfaces.ts#L24)

___

### address

Ƭ **address**: `string`

#### Defined in

[interfaces.ts:5](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/interfaces.ts#L5)

___

### i128

Ƭ **i128**: `bigint`

#### Defined in

[interfaces.ts:4](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/interfaces.ts#L4)

___

### u32

Ƭ **u32**: `number`

#### Defined in

[interfaces.ts:3](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/401c5fb/src/interfaces.ts#L3)
