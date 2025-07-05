/**
 * @notice - To convert a Uint8Array proof to a hex string (proofHex) suitable for passing to a Solidity verifier, you can use the following function in TypeScript/JavaScript:
 */
export function uint8ArrayToHex(proof: Uint8Array): string {
  return '0x' + Array.from(proof)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  // let proofHex = Array.from(proof)
  //   .map((s) => "0x" + s.toString(16).padStart(64, "0"));
  // return proofHex;
}
