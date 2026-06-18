# Walrus Agent Memory Contracts

Sui Move smart contracts for on-chain memory indexing and access control.

## Modules

### `memory_index`
Main contract handling:
- Memory record creation and metadata storage
- Access control and permission grants
- Event emission for state changes

## Build

```bash
sui move build
```

## Test

```bash
sui move test
```

## Deploy

```bash
sui client publish --gas-budget 10000000
```

## Architecture

The contract stores minimal on-chain data:
- Memory metadata (type, timestamps, version)
- Walrus blob references (for data retrieval)
- Access control information (permissions, grants)
- Event logs (for history tracking)

All actual data is stored off-chain in Walrus, with the contract serving as a verifiable index.
