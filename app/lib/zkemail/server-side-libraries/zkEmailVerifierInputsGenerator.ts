import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";      /// [NOTE]: This modules (icl. verifyDKIMSignature() function) would can work in only server-side. 
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr";     /// [NOTE]: This generateEmailVerifierInputs() function would can work in only server-side. 
//import { generateCircuitInputs } from '@zkpersona/noir-social-verify';  /// [NOTE]: This generateCircuitInputs() function would can work in only server-side. 


/**
 * @notice - [NOTE]: The generateEmailVerifierInputs() in this function is only working in server-side. (So, we may implement the server-side with "express"/"axious", etc going forward to use the generateEmailVerifierInputs())
 * @dev - This function is used to extract the email header and body from the raw email text.
 * @param rawEmail - The raw email text.
 */
export async function extractEmailVerifierInputs(
    rawEmail: string,
    //rawEmail: Buffer | string,
    //params: InputGenerationArgs = {}
): Promise<{ zkEmailInputs: any }> {

    /// @dev - [TEST]: The "zk-email/zkemail-nr" library
    const zkEmailInputs = await generateEmailVerifierInputs(rawEmail, {
        maxBodyLength: 64000,     // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit
        //maxBodyLength: 1280,    // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit (NOTE: This is the original value)
        maxHeadersLength: 2048,   // Same as MAX_EMAIL_HEADER_LENGTH in circuit
        //maxHeadersLength: 1408, // Same as MAX_EMAIL_HEADER_LENGTH in circuit (NOTE: This is the original value)
        shaPrecomputeSelector: "",
        //shaPrecomputeSelector: "some string in body up to which you want to hash outside circuit",
    });
    //console.log(`zkEmailInputs: ${ JSON.stringify(zkEmailInputs, null, 2) }`);

    return { zkEmailInputs };
}

/**
 * @notice - [NOTE]: The verifyDKIMSignature() in this function is only working in server-side. (So, we may implement the server-side with "express"/"axious", etc going forward to use the verifyDKIMSignature())
 * @description Generate a dkimResult from raw email content
 * @param rawEmail Full email content as a buffer or string
 * @param params Arguments to control the input generation
 * @returns a dkimResult
 */
export async function getDKIMResult(
    rawEmail: string,
    //rawEmail: Buffer | string,
    params: InputGenerationArgs = {}
) {
  const dkimResult = await verifyDKIMSignature(rawEmail, undefined, undefined, true);
  console.log("DKIM Result:", dkimResult);
  
  const { headers, body, bodyHash, publicKey, signature, modulusLength } = dkimResult;

  return dkimResult;
}


// /**
//  * @notice - Extracts the circuit inputs from the raw email text.
//  * @dev - [Result]: "node::buffer" error, meaning that the function can be working in only server-side. 
//  */
// export async function extractCircuitInputs(
//     rawEmail: string,
// ): Promise<{ circuitInputs: any }> {

//     const circuitInputs = await generateCircuitInputs(rawEmail, 'google');

//     return circuitInputs;
// }