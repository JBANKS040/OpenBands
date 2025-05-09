echo "Load the environment variables from the .env file..."
#source .env
. ./.env

echo "Run the noir-test-data.ts..."
npx tsx scripts/utils/test-data-generators/noir-jwt/js/scripts/noir-test-data.ts