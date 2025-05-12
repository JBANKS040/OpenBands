import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";   /// [NOTE]: This modules (icl. verifyDKIMSignature() function) would can work in only server-side. 
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr";  /// [NOTE]: This generateEmailVerifierInputs() function would can work in only server-side. 


/**
 * @notice - [NOTE]: The generateEmailVerifierInputs() in this function is only working in server-side. (So, we may implement the server-side with "express"/"axious", etc going forward to use the generateEmailVerifierInputs())
 * @dev - This function is used to extract the email header and body from the raw email text.
 * @param rawEmail - The raw email text.
 */
export async function extractEmailVerifierInputs(
    rawEmail: string,
    //rawEmail: Buffer | string,
    params: InputGenerationArgs = {}
): Promise<{ header: string; body: string }> {

    /// @dev - [TEST]: The "zk-email/zkemail-nr" library
    const zkEmailInputs = await generateEmailVerifierInputs(rawEmail, {
        maxBodyLength: 1280,
        maxHeadersLength: 1408,
        shaPrecomputeSelector: "some string in body up to which you want to hash outside circuit",
    });

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
  //const { headers, body, bodyHash, publicKey, signature, modulusLength } = dkimResult;

  return dkimResult;
}