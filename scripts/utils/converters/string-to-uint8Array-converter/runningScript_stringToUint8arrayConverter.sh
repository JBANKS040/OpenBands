echo "Load the environment variables from the .env file..."
#source .env
. ./.env

echo "Run the stringToUint8arrayConverter.ts with the async mode..."
npx tsx scripts/utils/converters/string-to-uint8Array-converter/stringToUint8arrayConverter.ts
#npx ts-node scripts/utils/converters/string-to-uint8Array-converter/stringToUint8arrayConverter.ts

# See the detail of how to run a Typescript (Node.js) file in shell script: https://nodejs.org/en/learn/typescript/run#running-typescript-with-a-runner