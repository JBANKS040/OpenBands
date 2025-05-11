//import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim"; /// [NOTE]: This modules would can work in only server-side. 
//import { ZkEmailSDKProvider } from "@zk-email/zk-email-sdk";


/**
 * @dev - This function is used to extract the email header and body from the raw email text.
 * @param rawEmail - The raw email text.
 */
export async function extractEmailHeaderAndBody(
    rawEmail: string,
    //rawEmail: Buffer | string,
    params: InputGenerationArgs = {}
): Promise<{ header: string; body: string }> {
    // const regexForHeaderExtraction = /^Subject:\s*(.+)$/im;
    // const regexForBodyExtraction = /^Content-Type:\s*[text/plain]/im;
    // const header = rawEmail.match(regexForHeaderExtraction);
    // const body = rawEmail.match(regexForBodyExtraction);

    /// @dev - Extract the email header and body, which the HTML part is cut off, from the entire (raw) email text.
    const headerAndBodyWithoutHtmlPart = extractHeaderAndBodyWithoutHtmlPart(rawEmail);
    console.log(`headerAndBodyWithoutHtmlPart: ${headerAndBodyWithoutHtmlPart}`);

    /// @dev - Extract the email body, which the below part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".
    const bodyWithoutHeader = extractBodyWithoutHeader(headerAndBodyWithoutHtmlPart);
    console.log(`bodyWithoutHeader: ${bodyWithoutHeader}`);

    /// @dev - Extract the email header, which the above part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".  
    const headerWithoutBody = extractHeaderWithoutBody(headerAndBodyWithoutHtmlPart);
    console.log(`headerWithoutBody: ${headerWithoutBody}`);

    const header = headerWithoutBody;
    const body = bodyWithoutHeader;

    return { header, body };
}

/** 
 * @dev - Extract the email header and body, which the HTML part is cut off, from the entire (raw) email text.
 */
function extractHeaderAndBodyWithoutHtmlPart(rawEmail: string) {
    const delimiter = "Content-Type: text/html;";
    const index = rawEmail.indexOf(delimiter);
    if (index === -1) return rawEmail; // Fallback if not found
    // Return everything before the delimiter
    const headerAndBodyWithoutHtmlPart = rawEmail.substring(0, index).trim();
    console.log(`headerAndBodyWithoutHtmlPart: ${headerAndBodyWithoutHtmlPart}`);
    return headerAndBodyWithoutHtmlPart;
}

/** 
 * @dev - Extract the email body, which the below part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".
 */
function extractBodyWithoutHeader(headerAndBodyWithoutHtmlPart: string) {
    const delimiter = 'Content-Type: text/plain;';
    const indexOfContentTypeTextPlain = headerAndBodyWithoutHtmlPart.indexOf(delimiter);
    if (indexOfContentTypeTextPlain === -1) return ''; // fallback: return full text if delimiter not found
    // Move past the delimiter and any trailing newlines or spaces
    const _bodyWithoutHeader = headerAndBodyWithoutHtmlPart.slice(indexOfContentTypeTextPlain + delimiter.length);
    const bodyWithoutHeader = _bodyWithoutHeader.trimStart();
    console.log(`bodyWithoutHeader: ${bodyWithoutHeader}`);
    return bodyWithoutHeader;
}

/** 
 * @dev - Extract the email header, which the above part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".
 */
function extractHeaderWithoutBody(headerAndBodyWithoutHtmlPart: string) {
    const delimiter = 'Content-Type: text/plain;';
    const indexOfContentTypeTextPlain = headerAndBodyWithoutHtmlPart.indexOf(delimiter);
    if (indexOfContentTypeTextPlain === -1) return ''; // fallback: return full text if delimiter not found
    // Move past the delimiter and any trailing newlines or spaces
    const headerWithoutBody = headerAndBodyWithoutHtmlPart.substring(0, indexOfContentTypeTextPlain).trim(); // Extract everything before the delimiter
    console.log(`headerWithoutBody: ${headerWithoutBody}`);
    return headerWithoutBody;
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
