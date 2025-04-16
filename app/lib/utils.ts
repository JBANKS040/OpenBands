/**
 * Convert a byte array to a BigInt
 * @param bytes - The byte array to convert
 * @returns The BigInt representation of the byte array
 */
export function bytesToBigInt(bytes: Uint8Array): bigint {
  let value = BigInt(0);
  for (let i = 0; i < bytes.length; i++) {
    value = (value << BigInt(8)) | BigInt(bytes[i]);
  }
  return value;
}

/**
 * Convert a BigInt to a byte array
 * @param value - The BigInt to convert
 * @param length - The length of the byte array
 * @returns The byte array representation of the BigInt
 */
export function bigIntToBytes(value: bigint, length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[length - 1 - i] = Number((value >> BigInt(8 * i)) & BigInt(255));
  }
  return bytes;
}

/**
 * Convert a BigInt to an array of limbs
 * @param value - The BigInt to convert
 * @param limbSize - The size of each limb in bits
 * @param numLimbs - The number of limbs
 * @returns An array of BigInt limbs
 */
export function splitBigIntToLimbs(value: bigint, limbSize: number, numLimbs: number): bigint[] {
  const limbs: bigint[] = [];
  const mask = (BigInt(1) << BigInt(limbSize)) - BigInt(1);

  for (let i = 0; i < numLimbs; i++) {
    limbs.push((value >> BigInt(i * limbSize)) & mask);
  }

  return limbs;
}

/**
 * Convert a JsonWebKey to a BigInt modulus
 * @param jwk - The JsonWebKey to convert
 * @returns The BigInt modulus
 */
export async function pubkeyModulusFromJWK(jwk: JsonWebKey): Promise<bigint> {
  if (!jwk.n) {
    throw new Error("JWK does not contain modulus");
  }

  // Convert base64url to base64
  const base64 = jwk.n.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if needed
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  // Convert base64 to bytes
  const bytes = Uint8Array.from(atob(paddedBase64), (c) => c.charCodeAt(0));
  // Convert bytes to BigInt
  return bytesToBigInt(bytes);
}

/**
 * Generate a random string of specified length
 * @param length - The length of the string
 * @returns A random string
 */
export function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 