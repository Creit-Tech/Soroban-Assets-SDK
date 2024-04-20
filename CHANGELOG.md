# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.6.0] - 2024-04-20

### Removed

- Wrap function removed because the stellar sdk now supports that directly

### Changed

- Use RPC provided by the developer instead of creating a new one inside the class
- Switch from npm to pnpm

## [0.5.2] - 2024-01-12

### Fixed

- Fix Github actions file

## [0.5.1] - 2024-01-12

### Added

- Add Github action to make npm publishing automatic

### Changed

- Move away from Github publishing and instead we now use classic npm repositories so is easier for others
- Soroban client was changed for Stellar SDK

## [0.2.0] - 2023-11-08

### Added

- Bump contract instance function (with test)
- Bump contract code function
- Bump soroban-client version to 1.0.0-beta.4

## [0.0.1] - 2023-10-29

### Added

- Initial version of the SDK