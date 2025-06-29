echo "Remove existing modules in the `./contracts/lib/` directory in advance..."
rm -rf lib/* 

echo "Install the `foundry-noir-helper` libary..."
forge install 0xnonso/foundry-noir-helper --no-commit