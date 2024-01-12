[@creit-tech/soroban-assets-sdk](README.md) / Exports

# @creit-tech/soroban-assets-sdk

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

[interfaces.ts:24](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L24)

___

### DefaultCallParams

Ƭ **DefaultCallParams**<`T`\>: `T` & { `fee?`: `string` ; `memo?`: `Memo`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[interfaces.ts:27](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L27)

___

### DefaultRequestParams

Ƭ **DefaultRequestParams**<`T`\>: `T` & { `memo?`: `Memo` ; `sourceAccount`: [`address`](modules.md#address) ; `timeout?`: `number`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[interfaces.ts:65](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L65)

___

### InstanceDataKey

Ƭ **InstanceDataKey**: [``"Admin"``] \| [``"AssetInfo"``]

#### Defined in

[interfaces.ts:25](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L25)

___

### address

Ƭ **address**: `string`

#### Defined in

[interfaces.ts:6](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L6)

___

### i128

Ƭ **i128**: `bigint`

#### Defined in

[interfaces.ts:5](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L5)

___

### u32

Ƭ **u32**: `number`

#### Defined in

[interfaces.ts:4](https://github.com/Creit-Tech/Soroban-Assets-SDK/blob/8a9b06f/src/interfaces.ts#L4)
