//import { Buffer } from "buffer";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";

/**
 * @description Generate circuit inputs for the EmailVerifier circuit from raw email content
 * @param rawEmail Full email content as a buffer or string
 * @param params Arguments to control the input generation
 * @returns Circuit inputs for the EmailVerifier circuit
 */
export async function getDKIMResult(
//export async function generateEmailVerifierInputs(
    rawEmail: string,
    //rawEmail: Buffer | string,
    params: InputGenerationArgs = {}
) {
  const dkimResult = await verifyDKIMSignature(rawEmail, undefined, undefined, true);
  console.log("DKIM Result:", dkimResult);
  //const { headers, body, bodyHash, publicKey, signature, modulusLength } = dkimResult;

  return dkimResult;
  //return generateEmailVerifierInputsFromDKIMResult(dkimResult, params);
}
