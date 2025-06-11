/**
 * @notice - Convert Uint8Array to String
 */
export async function convertUint8ArrayToString(valueInUint8Array: Uint8Array): Promise<String> { // Mark the function as async
    /// @dev - Convert "Uint8Array" to "ArrayBuffer"
    /// @dev - To avoid the "TypeError: Failed to execute 'decode' on 'TextDecoder': The provided value is not of type 'ArrayBuffer'" error, we need to convert the Uint8Array to ArrayBuffer first.
    const _valueInUint8Array = new Uint8Array(valueInUint8Array);

    /// @dev - Convert Uint8Array to String
    const decoder = new TextDecoder();
    const valueInString = decoder.decode(_valueInUint8Array);
    //console.log(`\nValue in String:\n${ JSON.stringify(valueInString, null, 2) }`);

    return valueInString; // Return the resolved value
}