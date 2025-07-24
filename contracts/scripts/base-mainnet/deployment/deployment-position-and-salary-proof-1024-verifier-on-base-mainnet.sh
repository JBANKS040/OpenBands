echo "Compiling the smart contracts..."
forge build --evm-version cancun

echo "Copy the artifacts (icl. ABIs) and paste them into the ./app/lib/smart-contracts/evm/smart-contracts/artifacts directory"
cp -r out/* ../app/lib/smart-contracts/evm/smart-contracts/artifacts

# @notice - This script file must be run from the root directory of the project, where is the location of .env file.
echo "Load the environment variables from the .env file..."
source .env
#. ./.env

# @notice - [Result]: Successfully deployed + "verified" the PositionAndSalaryProof1024Verifier contract on BASE mainnet. (NOTE: Only single SC - Not multiple SCs)
echo "Deploying & Verifying the PositionAndSalaryProof1024Verifier contract on Base mainnet..."
forge script scripts/base-mainnet/deployment/DeploymentForPositionAndSalaryProof1024Verifier.s.sol --slow --multi --broadcast --private-key ${BASE_MAINNET_PRIVATE_KEY} --verify --etherscan-api-key ${BASESCAN_API_KEY}
