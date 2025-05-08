//import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim"; /// [NOTE]: This modules would can work in only server-side. 

import { headers } from "next/headers";



// [TODO]: 
export async function extractEmailHeaderAndBody(
    rawEmail: string,
    //rawEmail: Buffer | string,
    params: InputGenerationArgs = {}
): Promise<{ header: string; body: string }> {
    let header = "test header";
    let body = "test body";

    return { header, body };
}




/**
 * @notice - But, this function is not working in client-side. (So, we need to implement another function above)
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
//   const dkimResult = await verifyDKIMSignature(rawEmail, undefined, undefined, true);
//   console.log("DKIM Result:", dkimResult);
//   //const { headers, body, bodyHash, publicKey, signature, modulusLength } = dkimResult;
// 
//   return dkimResult;
}
