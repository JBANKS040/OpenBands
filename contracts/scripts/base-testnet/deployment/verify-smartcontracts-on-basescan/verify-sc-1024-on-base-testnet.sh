# @notice - This script file must be run from the root directory of the project, where is the location of .env file.
echo "Load the environment variables from the .env file..."
source .env
#. ./.env

echo "Verify the deployed-HonkVerifier contract on Base Sepolia Testnet Explorer..."
forge verify-contract \
    --chain-id ${BASE_TESTNET_CHAIN_ID} \
    --rpc-url ${BASE_TESTNET_RPC} \
    --num-of-optimizations 1000000 \
    --watch ${HONKVERIFIER_1024_ON_BASE_TESTNET} \
    #--constructor-args $(cast abi-encode "constructor(string,string,uint256,uint256)" "ForgeUSD" "FUSD" 18 1000000000000000000000) \
    --verifier etherscan \
    --etherscan-api-key ${BASESCAN_API_KEY} \
    --compiler-version v0.8.28 \
    ./contracts/src/circuits/circuit-for-zkemail-1024-bit-dkim/honk-verifier/honk_vk_for_1024-bit-dkim.sol:HonkVerifier





# Ref: https://getfoundry.sh/forge/deploying#verifying-a-pre-existing-contract
# 
# forge verify-contract \
#     --chain-id 11155111 \
#     --num-of-optimizations 1000000 \
#     --watch \
#     --constructor-args $(cast abi-encode "constructor(string,string,uint256,uint256)" "ForgeUSD" "FUSD" 18 1000000000000000000000) \
#     --verifier etherscan \
#     --etherscan-api-key <your_etherscan_api_key> \
#     --compiler-version v0.8.10+commit.fc410830 \
#     <CONTRACT_ADDRESS> \
#     src/MyToken.sol:MyToken