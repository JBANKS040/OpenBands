/**
 * @notice - Slice a hex string type of proof (NOTE: Each byte is 2 * hex characters)
 * @param hex - a hex string type of proof
 * @param byteOffset - i.e. "32" means "32 bytes to be cut off"
 * @returns - a sliced hex string type of proof
 */
export function sliceHexStringProof(hex: string, byteOffset: number): string {
  if (!hex.startsWith("0x")) throw new Error("Invalid hex string");
  return "0x" + hex.slice(2 + byteOffset * 2);
}