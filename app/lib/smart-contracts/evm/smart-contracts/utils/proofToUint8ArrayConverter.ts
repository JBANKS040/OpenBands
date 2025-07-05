/**
 * @notice - Convert a proof object to a Uint8Array value
 */
export function proofToUint8Array(proof: any): Uint8Array {
  // Step 1: Sort keys numerically
  const sortedKeys = Object.keys(proof).sort((a, b) => Number(a) - Number(b));

  // Step 2: Collect values in order
  const values = sortedKeys.map((key) => proof[key]);

  // Step 3: Convert to Uint8Array
  const proofUint8Array = new Uint8Array(values);

  return proofUint8Array;
}