echo "Compiling the smart contracts..."
forge build --evm-version cancun

echo "Copy the artifacts (icl. ABIs) and paste them into the ./app/lib/smart-contracts/evm/smart-contracts/artifacts directory"
cp -r out/* ../app/lib/smart-contracts/evm/smart-contracts/artifacts

# @notice - This script file must be run from the root directory of the project, where is the location of .env file.
echo "Load the environment variables from the .env file..."
source .env
#. ./.env

# echo "Deploying the HonkVerifier and PositionAndSalaryProof2048Verifier contract on Base Sepolia Testnet..."
# forge script scripts/base-testnet/deployment/DeploymentForHonkVerifier2048.s.sol \
#     --broadcast \
#     --rpc-url ${BASE_TESTNET_RPC} \
#     --chain-id ${BASE_TESTNET_CHAIN_ID} \
#     --private-key ${BASE_TESTNET_PRIVATE_KEY} \
#     ./contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier/honk_vk_for_2048-bit-dkim.sol:HonkVerifier \
#     ./contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/PositionAndSalaryProof2048Verifier.sol:PositionAndSalaryProof2048Verifier --skip-simulation --legacy

# @notice - [Result]: Successfully deployed + "verified" the HonkVerifier contract on Base Sepolia Testnet. (NOTE: Only single SC - Not multiple SCs)
echo "Deploying & Verifying the HonkVerifier and PositionAndSalaryProof2048Verifier contract on Base Sepolia Testnet..."
forge script scripts/base-testnet/deployment/DeploymentForHonkVerifier2048.s.sol --slow --multi --broadcast --private-key ${BASE_TESTNET_PRIVATE_KEY} --verify --etherscan-api-key ${BASESCAN_API_KEY}

# [NOTE - Adding the "--legacy" option]: Due to this error - Error: Failed to estimate EIP1559 fees. This chain might not support EIP1559, try adding --legacy to your command.

################################################################################################################
# @notice - The following commands are used to verify the deployed contracts on Base Sepolia Testnet Explorer. #
################################################################################################################

# echo "Verify the deployed-HonkVerifier and PositionAndSalaryProof2048Verifier contract on Base Sepolia Testnet Explorer..."
# forge script contracts/scripts/base-testnet/deployment/DeploymentForHonkVerifier2048.s.sol \
#     --rpc-url ${BASE_TESTNET_RPC} \
#     --chain-id ${BASE_TESTNET_CHAIN_ID} \
#     --private-key ${BASE_TESTNET_PRIVATE_KEY} \
#     --resume \
#     --verify \
#     --verifier etherscan \
#     --verifier-url https://api-sepolia.basescan.org/api \
#     --etherscan-api-key ${BASESCAN_API_KEY} \
