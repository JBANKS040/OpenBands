import * as fs from "fs";

import { getEmailHeaderInUint8Array, getEmailBodyInUint8Array } from "./input/inputDataInUint8ArrayGenerator.ts";

/**
 * @notice - The main function
 */
async function main(): Promise<String> { // Mark the function as async
    const HEADER = await getEmailHeaderInUint8Array();
    const BODY = await getEmailBodyInUint8Array();
    //const uint8Array = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]);

    const emailHeaderInUint8array = new Uint8Array(HEADER);
    const emailBodyInUint8array = new Uint8Array(BODY);

    /// @dev - Convert Uint8Array to String
    const decoder = new TextDecoder();
    const emailHeaderInString = decoder.decode(emailHeaderInUint8array);
    const emailBodyInString = decoder.decode(emailBodyInUint8array);
    console.log(`\nEmail Header (in String):\n${ emailHeaderInString }`); // Output: "Hello, World!"
    console.log(`\nEmail Body (in String):\n${ emailBodyInString }`); // Output: "Hello, World!"

    /// @dev - Export as a JSON file
    const result = {
        emailHeaderInString: emailHeaderInString,
        emailBodyInString: emailBodyInString,
    };
    exportJSON(result, "scripts/utils/converters/uint8Array-to-string-converter/output/output.json");

    return { emailHeaderInString, emailBodyInString }; // Return the resolved value
}

/**
 * @notice - The function to export JSON file
 */
function exportJSON(data: object, filename: string = "output.json") {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
    console.log(`JSON saved to ${filename}`);
}

/**
 * @notice - Execute the main function
 */
main().then((result) => {
    console.log(`Result: ${result}`);
}).catch((error) => {
    console.error(`Error: ${error}`);
});