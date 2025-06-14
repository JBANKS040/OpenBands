/// @notice - To call the following functions, the "next.config.mjs" file (icl. "webpack" setting) must be set in the ./app directory in order to allow to run the "node" environment on client-side and prevent from the "node::buffer" error on client-side.
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";

export const MAX_HEADER_LENGTH = 1504;
export const MAX_BODY_LENGTH = 32000;
export const MAX_BODY_TRIMMED_LENGTH = 2048;

/**
 * @description - This function is used to generate the inputs for the zkEmail based verifier circuit.
 * @param rawEmail - The raw email text, which is extracted from a EML file (.eml file)
 */
export async function generateZkEmailVerifierInputs(
    rawEmail: string,
    //rawEmail: Buffer | string,
    //params: InputGenerationArgs = {}
): Promise<{ zkEmailInputs: any }> {
    const zkEmailInputs = await generateEmailVerifierInputs(rawEmail, {
        maxBodyLength: 32000,     // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit
        //maxBodyLength: 1280,    // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit (NOTE: This is the original value)
        maxHeadersLength: 1504,   // Same as MAX_EMAIL_HEADER_LENGTH in circuit
        //maxHeadersLength: 1408, // Same as MAX_EMAIL_HEADER_LENGTH in circuit (NOTE: This is the original value)
        shaPrecomputeSelector: "",
        //shaPrecomputeSelector: "Content-Type: text/html",
        //shaPrecomputeSelector: "some string in body up to which you want to hash outside circuit",
    });
    //console.log(`zkEmailInputs: ${ JSON.stringify(zkEmailInputs, null, 2) }`);

    return { zkEmailInputs };
}

/**
 * @description Generate a dkimResult from raw email content, which is extracted from a EML file (.eml file)
 * @param rawEmail Full email content as a buffer or string
 * @returns a dkimResult
 */
export async function getDKIMResult(
    rawEmail: string,
    //rawEmail: Buffer | string,
    //params: InputGenerationArgs = {}
) {
  const dkimResult = await verifyDKIMSignature(rawEmail, undefined, undefined, true);
  console.log("DKIM Result:", dkimResult);
  
  const { headers, body, bodyHash, publicKey, signature, modulusLength } = dkimResult;

  return dkimResult;
}