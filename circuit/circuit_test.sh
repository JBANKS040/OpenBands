echo "Load the environment variables from the .env file..."
source ../.env
#. ./.env

echo "Test of ZK circuit"
nargo test --show-output