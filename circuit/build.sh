#!/bin/bash

# Extract version from Nargo.toml
VERSION=$(grep '^version = ' Nargo.toml | cut -d '"' -f 2)
echo "Circuit version: $VERSION"

# Clean previous build
rm -rf target

echo "Compiling circuit..."
if ! nargo compile; then
    echo "Compilation failed. Exiting..."
    exit 1
fi

echo "Gate count:"
bb gates -b target/openbands.json | jq '.functions[0].circuit_size'

# Create version-specific directory
mkdir -p "../app/assets/openbands-$VERSION"
mkdir -p "target/vk"

echo "Copying circuit.json to app/assets/openbands-$VERSION..."
cp target/openbands.json "../app/assets/openbands-$VERSION/circuit.json"

echo "Generating verification key..."
bb write_vk -b ./target/openbands.json -o ./target/vk

echo "Generating vkey.json to app/assets/openbands-$VERSION..."
node -e "const fs = require('fs'); fs.writeFileSync('../app/assets/levels-$VERSION/circuit-vkey.json', JSON.stringify(Array.from(Uint8Array.from(fs.readFileSync('./target/vk/vk')))));"

echo "Done" 