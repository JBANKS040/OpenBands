//import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim"; /// [NOTE]: This modules would can work in only server-side. 
//import { ZkEmailSDKProvider } from "@zk-email/zk-email-sdk";

import { headers } from "next/headers";



// [TODO]: 
export async function extractEmailHeaderAndBody(
    rawEmail: string,
    //rawEmail: Buffer | string,
    params: InputGenerationArgs = {}
): Promise<{ header: string; body: string }> {
    //let header = "test header";
    //let body = "test body";


    const header = rawEmail.match(/^Subject:\s*(.+)$/im);
    //console.log(`header: ${header}`);

    //const boundaryOfBeginning = "Content-Type: text/plain;";
    //const boundaryOfEnd = "Content-Type:";
    //const regex = new RegExp(`${boundaryOfBeginning}[\\r\\n]+([\\s\\S]*?)[\\r\\n]+${boundaryOfEnd}`, 'm');
    //const body = rawEmail.match(regex);
    const regex = /^Content-Type:\s*[text/plain]/im;
    //const regex = /Content-Type:\s*text\/plain[^]*?(?:\r?\n){2}([^]*?)(?=\r?\n[-]+.*Content-Type:\s*text\/html)/i;
    const body = rawEmail.match(regex);
    //console.log(`body: ${body}`);


    // const parts = rawEmail.split(/\r?\n\r?\n/); // split at first empty line
    // console.log(`Email Body: ${parts}`);

    /// @dev - Extract the email header and body, which the HTML part is cut off, from the entire (raw) email text.
    const delimiter = "Content-Type: text/html;";
    const index = rawEmail.indexOf(delimiter);
    if (index === -1) return rawEmail; // Fallback if not found
    // Return everything before the delimiter
    const headerAndBodyWithoutHtmlPart = rawEmail.substring(0, index).trim();
    console.log(`headerAndBodyWithoutHtmlPart: ${headerAndBodyWithoutHtmlPart}`);

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

//   return dkimResult;
}
