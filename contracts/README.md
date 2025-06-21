# Smart Contracts to be deployed on BASE

## Overview
- IN PROGRESS


<br>

## Compile Smart Contracts

- Compile the smart contracts:
  - And then, the `artifacts` (icl. `ABIs`) would be copied and pasted into the `./app/lib/smart-contracts/evm/smart-contracts/artifacts` directory:
```bash
cd contracts
sh compileContracts.sh
```

<br>

## Smart Contract Deployment

- NOTE: This script file must be run from the `root` directory of this project, where is the location of `.env` file.
```bash
cd contracts
sh scripts/base-testnet/deployment/deployment-1024-on-base-testnet.sh
```
```bash
cd contracts
sh scripts/base-testnet/deployment/deployment-2048-on-base-testnet.sh
```
```bash
cd contracts
sh scripts/base-testnet/deployment/deployment-on-base-testnet.sh
```