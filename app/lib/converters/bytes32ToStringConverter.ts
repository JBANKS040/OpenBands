import { 
  ethers, 
  solidityPacked, 
  dataSlice, 
  decodeBytes32String 
} from 'ethers';


/**
 * @notice - Convert Uint8Array to String
 */
export async function convertBytes32ToString(valueInBytes32: Array<string>): Promise<String> { // Mark the function as async
  // const inputs = [
  //   "0x0000000000000000000000000000000000c7184693f23f7cdb67908a5f476f4d",
  //   "0x0000000000000000000000000000000000ab71e083f22fd3c3756718d87f4a37",
  // ];

  const unpacked: bigint[] = [];
  for (let i = 0; i < valueInBytes32.length; i++) {
    //const slice = dataSlice(valueInBytes32[i], i * 32, (i + 1) * 32);
    //unpacked.push(BigInt(slice));
    unpacked.push(BigInt(decodeBytes32String(valueInBytes32[i])));
  }

  console.log(`unpacked: ${ unpacked }`);

  let valueInString: string = '';  // @dev - Temporary variable to hold the string value
  return valueInString; // Return the resolved value
}