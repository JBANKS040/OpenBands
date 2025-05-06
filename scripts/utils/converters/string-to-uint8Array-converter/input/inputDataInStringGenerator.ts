/**
 * @notice - Generate an email body data in String format
 */
export async function getEmailBodyInString() {
    /// @dev - Default email body text
    //let BODY = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks\r\n\r\n15 years ago, Satoshi mined the first block of the Bitcoin blockchain =\r\nAfter the Bitcoin white paper appeared on October 31, 2008, on a =\r\ncryptography mailing list, the Genesis Block =E2=80=94 the first bitcoin =\r\nblock and the basis of the entire Bitcoin trading system in place to =\r\nthis day =E2=80=94 was mined on January 3, 2009.=20\r\n\r\nThe Genesis Block is also known as Block 0 or Block 1, and is still in =\r\nthe Bitcoin network, where it will remain as long as there is a computer =\r\nrunning the Bitcoin software.=20\r\n\r\nAll nodes in the Bitcoin network can consult it, even if it is at the =\r\nother end of the network with hundreds of thousands of blocks.\r\n";

    let EMAIL_HEADER = "Job Offer from AxBxC Corp";  // [Log]: 74,111,98,32,79,102,102,101,114,32,102,114,111,109,32,65,120,66,120,67,32,67,111,114,112

    /// @dev - Email body text, which includes a position and salary.
    let EMAIL_BODY = "Dear Alice,\r\nWe are pleased to officially confirm your employment with AxBxC Corp. You will be joining us as a Senior Software Engineer, reporting to Bob David, starting on June 1.\r\nYour starting annual salary will be $100,000, payable on a annually basis, subject to standard deductions and withholdings. You will also be eligible for health insurance, as outlined in the employee handbook.\r\nWe’re excited to have you on board and look forward to seeing you grow with us. Please feel free to reach out if you have any questions before your start date.\r\nWelcome to the team!\r\nWarm regards,\r\nAlice Elisabeth\r\nSenior Software Engineer\r\nAxBxC Corp\r\ncontact@axbxc.com";

    /// @dev - Part of Email body text, which a "position" is extracted.
    let POSITION_BODY = "Senior Software Engineer";  // [Log]: 83,101,110,105,111,114,32,83,111,102,116,119,97,114,101,32,69,110,103,105,110,101,101,114

    /// @dev - Part of Email body text, which a "salary" is extracted.
    let SALARY_BODY = "$100,000"    // [Log]: 36,49,48,48,44,48,48,48

    /// @dev - TEST
    //let DOMAIN_BODY = "test.com"  // [Log]: 116,101,115,116,46,99,111,109

    //return BODY;
    return EMAIL_HEADER;
    //return EMAIL_BODY;
    //return POSITION_BODY;
    //return SALARY_BODY;
}