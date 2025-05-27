echo "Load the environment variables from the .env file..."
source ../../.env
#. ./.env

echo "Run the test of ZK circuit"
nargo test --show-output