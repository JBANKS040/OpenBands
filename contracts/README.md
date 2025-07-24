# Smart Contracts to be deployed on BASE

## Overview
- IN PROGRESS


<br>

<hr>

## Installation

- Run the `forge-install.sh`:
```bash
cd contracts
sh forge-install.sh
```

Or,

- If there is modules under the `./contracts/lib/` directory, they should be removed in advance:
```bash
cd contracts
rm -rf lib/* 
```

- Install the `foundry-noir-helper` libary:
```bash
forge install 0xnonso/foundry-noir-helper --no-commit
```

<br>

## Compile Smart Contracts

- Compile the smart contracts:
  - And then, the `artifacts` (icl. `ABIs`) would be copied and pasted into the `./app/lib/smart-contracts/evm/smart-contracts/artifacts` directory:
```bash
cd contracts
sh compileContracts.sh
```

<br>

## Smart Contract Deployment on BASE `testnet`

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
sh scripts/base-testnet/deployment/deployment-position-and-salary-proof-1024-verifier-on-base-testnet.sh
```
```bash
cd contracts
sh scripts/base-testnet/deployment/deployment-position-and-salary-proof-2048-verifier-on-base-testnet.sh
```
```bash
cd contracts
sh scripts/base-testnet/deployment/deployment-position-and-salary-proof-manager-on-base-testnet.sh
```

- All (NOTE: Currently, this script is not used)
```bash
cd contracts
sh scripts/base-testnet/deployment/deployment-on-base-testnet.sh
```

<br>

## Smart Contract Deployment on BASE `mainnet`

- NOTE: This script file must be run from the `root` directory of this project, where is the location of `.env` file.
```bash
cd contracts
sh scripts/base-mainnet/deployment/deployment-1024-on-base-mainnet.sh
```
```bash
cd contracts
sh scripts/base-mainnet/deployment/deployment-2048-on-base-mainnet.sh
```
```bash
cd contracts
sh scripts/base-mainnet/deployment/deployment-position-and-salary-proof-1024-verifier-on-base-mainnet.sh
```
```bash
cd contracts
sh scripts/base-mainnet/deployment/deployment-position-and-salary-proof-2048-verifier-on-base-mainnet.sh
```
```bash
cd contracts
sh scripts/base-mainnet/deployment/deployment-position-and-salary-proof-manager-on-base-mainnet.sh
```

- All (NOTE: Currently, this script is not used)
```bash
cd contracts
sh scripts/base-mainnet/deployment/deployment-on-base-mainnet.sh
```

<br>

## Scripts of Smart Contracts

- Run the script of the Smart Contracts:
```bash
cd contracts
sh scripts/local-network/runningScript_PositionAndSalaryProof2048Verifier.sh
```