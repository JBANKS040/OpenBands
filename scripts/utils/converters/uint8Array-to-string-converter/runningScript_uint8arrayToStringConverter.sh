echo "Load the environment variables from the .env file..."
#source .env
. ./.env

echo "Run the uint8arrayToStringConverter.ts with the async mode..."
npx tsx scripts/utils/converters/uint8Array-to-string-converter/uint8arrayToStringConverter.ts
#npx ts-node scripts/utils/converters/string-to-uint8Array-converter/uint8arrayToStringConverter.ts

# See the detail of how to run a Typescript (Node.js) file in shell script: https://nodejs.org/en/learn/typescript/run#running-typescript-with-a-runner