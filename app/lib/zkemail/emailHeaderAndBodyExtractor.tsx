/**
 * @dev - This function is used to extract the email header and body from the raw email text.
 * @param rawEmail - The raw email text.
 */
export async function extractEmailHeaderAndBody(
    rawEmail: string,
    //rawEmail: Buffer | string,
    //params: InputGenerationArgs = {}
): Promise<{ header: string; body: string }> {
    // const regexForHeaderExtraction = /^Subject:\s*(.+)$/im;
    // const regexForBodyExtraction = /^Content-Type:\s*[text/plain]/im;
    // const header = rawEmail.match(regexForHeaderExtraction);
    // const body = rawEmail.match(regexForBodyExtraction);

    /// @dev - Extract the email header and body, which the HTML part is cut off, from the entire (raw) email text.
    const rawEmailWithoutHtmlPart = extractRawEmailWithoutHtmlPart(rawEmail);
    console.log(`rawEmailWithoutHtmlPart: ${rawEmailWithoutHtmlPart}`);

    /// @dev - Extract the email header, which the above part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".  
    const headerWithoutBody = extractHeaderWithoutBody(rawEmailWithoutHtmlPart);
    console.log(`headerWithoutBody: ${headerWithoutBody}`);

    /// @dev - Extract the email body, which the below part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".
    const bodyWithoutHeader = extractBodyWithoutHeader(rawEmailWithoutHtmlPart);
    console.log(`bodyWithoutHeader: ${bodyWithoutHeader}`);

    const header = headerWithoutBody;
    const body = bodyWithoutHeader;

    return { header, body };
}

/** 
 * @dev - Extract the email header and body, which the HTML part is cut off, from the entire (raw) email text.
 */
export function extractRawEmailWithoutHtmlPart(rawEmail: string) {
    const delimiter = "Content-Type: text/html;";
    const indexOfContentTypeTextHtml = rawEmail.indexOf(delimiter);
    if (indexOfContentTypeTextHtml === -1) return rawEmail; // Fallback if not found
    // Return everything before the delimiter
    const rawEmailWithoutHtmlPart = rawEmail.substring(0, indexOfContentTypeTextHtml).trim();
    console.log(`rawEmailWithoutHtmlPart: ${rawEmailWithoutHtmlPart}`);
    return rawEmailWithoutHtmlPart;
}

/** 
 * @dev - Extract the email body, which the below part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".
 */
export function extractBodyWithoutHeader(rawEmailWithoutHtmlPart: string) {
    const delimiter = 'Content-Type: text/plain;';
    const indexOfContentTypeTextPlain = rawEmailWithoutHtmlPart.indexOf(delimiter);
    if (indexOfContentTypeTextPlain === -1) return ''; // fallback: return full text if delimiter not found
    // Move past the delimiter and any trailing newlines or spaces
    const _bodyWithoutHeader = rawEmailWithoutHtmlPart.slice(indexOfContentTypeTextPlain + delimiter.length);
    const bodyWithoutHeader = _bodyWithoutHeader.trimStart();
    console.log(`bodyWithoutHeader: ${bodyWithoutHeader}`);
    return bodyWithoutHeader;
}

/** 
 * @dev - Extract the email header, which the above part of the "Content-Type: text/plain" is cut off from the "headerAndBodyWithoutHtmlPart".
 */
export function extractHeaderWithoutBody(rawEmailWithoutHtmlPart: string) {
    const delimiter = 'Content-Type: text/plain;';
    const indexOfContentTypeTextPlain = rawEmailWithoutHtmlPart.indexOf(delimiter);
    if (indexOfContentTypeTextPlain === -1) return ''; // fallback: return full text if delimiter not found
    // Move past the delimiter and any trailing newlines or spaces
    const headerWithoutBody = rawEmailWithoutHtmlPart.substring(0, indexOfContentTypeTextPlain).trim(); // Extract everything before the delimiter
    console.log(`headerWithoutBody: ${headerWithoutBody}`);
    return headerWithoutBody;
}