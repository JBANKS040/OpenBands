#!/bin/bash

# Extract version from Nargo.toml
VERSION=$(grep '^version = ' Nargo.toml | cut -d '"' -f 2)
echo "Circuit version: $VERSION"

# Clean previous build
rm -rf target

# Align the Noir/Nargo version and bb.js version of the local machine.
echo "Update the bb.js version of the local machine to v0.85.0..."
bbup --version 0.85.0

echo "Check the Noir/Nargo version of the local machine (This version is supposed to be v1.0.0-beta.6)..."
nargo -V

# Compile the ZK circuit
echo "Compiling circuit..."
if ! nargo compile; then
    echo "Compilation failed. Exiting..."
    exit 1
fi

echo "Gate count:"
bb gates -b target/openbands.json | jq '.functions[0].circuit_size'

# Create version-specific directory
mkdir -p "../../app/assets/openbands-zkemail-2048-bit-dkim-$VERSION"
#mkdir -p "../app/assets/openbands-$VERSION"
mkdir -p "target/vk"

echo "Copying circuit.json to app/assets/openbands-zkemail-2048-bit-dkim-$VERSION..."
cp target/openbands.json "../../app/assets/openbands-zkemail-2048-bit-dkim-$VERSION/openbands.json"
#cp target/openbands.json "../app/assets/openbands-$VERSION/openbands.json"

echo "Generating a vkey (verification key)..."
bb write_vk -b ./target/openbands.json -o ./target/vk --oracle_hash keccak

echo "Generating vk.json to app/assets/openbands-$VERSION..."
node -e "const fs = require('fs'); fs.writeFileSync('../../app/assets/openbands-zkemail-2048-bit-dkim-$VERSION/vk.json', JSON.stringify(Array.from(Uint8Array.from(fs.readFileSync('./target/vk/vk')))));"
#node -e "const fs = require('fs'); fs.writeFileSync('../app/assets/openbands-$VERSION/vk.json', JSON.stringify(Array.from(Uint8Array.from(fs.readFileSync('./target/vk/vk')))));"

echo "Generate a Solidity Verifier contract from the vkey..."
bb write_solidity_verifier -k ./target/vk/vk -o ./target/Verifier.sol

echo "Copy a Solidity Verifier contract-generated (Verifier.sol) into the ./contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier directory"
cp ./target/Verifier.sol ../../contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier

echo "Rename the Verifier.sol with the honk_vk.sol in the ./contracts/circuit/ultra-verifier directory"
mv ../../contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier/Verifier.sol ../../contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier/honk_vk_for_2048-bit-dkim.sol

echo "Done" 