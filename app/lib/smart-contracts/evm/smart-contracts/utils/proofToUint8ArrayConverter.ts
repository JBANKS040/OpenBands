/**
 * @notice - Convert a proof object to a Uint8Array value
 */
export function proofToUint8Array(proof: any): Uint8Array {
  const proofObj = proof || {};

  // Convert object with numeric keys to Array
  const proofArray = Object.keys(proofObj)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => proof[key]);

  // Convert to Uint8Array
  const proofUint8Array = new Uint8Array(proofArray);

  return proofUint8Array;
}