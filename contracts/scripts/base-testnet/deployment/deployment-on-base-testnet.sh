echo "Load the environment variables from the .env file..."
. ./.env

echo "Deploying the HonkVerifier and PositionAndSalaryProof1024Verifier contract on Base Sepolia Testnet..."
forge script script/base-testnet/deployment/DeploymentForHonkVerifier1024.s.sol \
    --broadcast \
    --rpc-url ${BASE_TESTNET_RPC} \
    --chain-id ${BASE_TESTNET_CHAIN_ID} \
    --private-key ${BASE_TESTNET_PRIVATE_KEY} \
    ./contracts/src/circuits/circuit-for-zkemail-1024-bit-dkim/honk-verifier/plonk_vk_for_1024-bit-dkim.sol:HonkVerifier \
    ./contracts/src/circuits/circuit-for-zkemail-1024-bit-dkim/PositionAndSalaryProof1024Verifier.sol:PositionAndSalaryProof1024Verifier --skip-simulation --legacy

echo "Deploying the HonkVerifier and PositionAndSalaryProof2048Verifier contract on Base Sepolia Testnet..."
forge script script/base-testnet/deployment/DeploymentForHonkVerifier2048.s.sol \
    --broadcast \
    --rpc-url ${BASE_TESTNET_RPC} \
    --chain-id ${BASE_TESTNET_CHAIN_ID} \
    --private-key ${BASE_TESTNET_PRIVATE_KEY} \
    ./contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier/plonk_vk_for_2048-bit-dkim.sol:HonkVerifier \
    ./contracts/src/circuits/circuit-for-zkemail-2048-bit-dkim/PositionAndSalaryProof2048Verifier.sol:PositionAndSalaryProof2048Verifier --skip-simulation --legacy

echo "Deploying the PositionAndSalaryProofManager contract on Base Sepolia Testnet..."
forge script script/base-testnet/deployment/DeploymentAllContracts.s.sol \
    --broadcast \
    --rpc-url ${BASE_TESTNET_RPC} \
    --chain-id ${BASE_TESTNET_CHAIN_ID} \
    --private-key ${BASE_TESTNET_PRIVATE_KEY} \
    ./contracts/src/circuits/PositionAndSalaryProofManager.sol:PositionAndSalaryProofManager \


# [NOTE - Adding the "--legacy" option]: Due to this error - Error: Failed to estimate EIP1559 fees. This chain might not support EIP1559, try adding --legacy to your command.

################################################################################################################
# @notice - The following commands are used to verify the deployed contracts on Base Sepolia Testnet Explorer. #
################################################################################################################

echo "Verify the deployed-HonkVerifier and PositionAndSalaryProof1024Verifier contract on Base Sepolia Testnet Explorer..."
forge script/base-testnet/deployment/DeploymentForHonkVerifier1024.s.sol \
    --rpc-url ${BASE_TESTNET_RPC} \
    --chain-id ${BASE_TESTNET_CHAIN_ID} \
    --private-key ${BASE_TESTNET_PRIVATE_KEY} \
    --resume \
    --verify \
    --verifier etherscan \
    --verifier-url https://api-sepolia.basescan.org/api \
    --etherscan-api-key ${BASESCAN_API_KEY} \

echo "Verify the deployed-HonkVerifier and PositionAndSalaryProof2048Verifier contract on Base Sepolia Testnet Explorer..."
forge script script/base-testnet/deployment/DeploymentForHonkVerifier2048.s.sol \
    --rpc-url ${BASE_TESTNET_RPC} \
    --chain-id ${BASE_TESTNET_CHAIN_ID} \
    --private-key ${BASE_TESTNET_PRIVATE_KEY} \
    --resume \
    --verify \
    --verifier etherscan \
    --verifier-url https://api-sepolia.basescan.org/api \
    --etherscan-api-key ${BASESCAN_API_KEY} \

echo "Verify the deployed-PositionAndSalaryProofManager contract on Base Sepolia Testnet Explorer..."
forge script script/base-testnet/deployment/DeploymentAllContracts.s.sol \
    --rpc-url ${BASE_TESTNET_RPC} \
    --chain-id ${BASE_TESTNET_CHAIN_ID} \
    --private-key ${BASE_TESTNET_PRIVATE_KEY} \
    --resume \
    --verify \
    --verifier etherscan \
    --verifier-url https://api-sepolia.basescan.org/api \
    --etherscan-api-key ${BASESCAN_API_KEY} \