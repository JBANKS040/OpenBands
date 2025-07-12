/**
 * @notice - Convert a "object" value to a "String" value
 */
export function bigIntToString(obj: any): any {
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(bigIntToString);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, bigIntToString(v)])
    );
  }
  return obj;
}