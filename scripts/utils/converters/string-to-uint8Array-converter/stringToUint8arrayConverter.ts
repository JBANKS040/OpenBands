import * as fs from "fs";

import { getEmailHeaderInUint8Array, getEmailBodyInString } from "./input/inputDataInStringGenerator.ts";

/**
 * @notice - The main function
 */
async function main(): Promise<String> { // Mark the function as async
    const HEADER = await getEmailHeaderInString();
    const BODY = await getEmailBodyInString();

    const emailHeaderInString = new String(HEADER);
    const emailBodyInString = new String(BODY);

    /// @dev - Convert String to Uint8Array
    const encoder = new TextEncoder();
    const emailHeaderInUint8array = encoder.encode(emailHeaderInString);
    const emailBodyInUint8array = encoder.encode(emailBodyInString);
    console.log(`Email Header (in Uint8Array):\n ${ emailHeaderInUint8array }`); // Output: "Hello, World!"
    console.log(`Email Body (in Uint8Array):\n ${ emailBodyInUint8array }`);     // Output: "Hello, World!"

    /// @dev - Export as a JSON file
    const result = {
        emailHeaderInUint8array: emailHeaderInUint8array,
        emailBodyInUint8array: emailBodyInUint8array,
    };
    exportJSON(result, "scripts/utils/converters/string-to-uint8Array-converter/output/output.json");

    return { emailHeaderInUint8array, emailBodyInUint8array }; // Return the resolved value
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