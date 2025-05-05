/**
 * @notice - Generate an email body data in String format
 */
export async function getEmailBodyInString() {
    /// @dev - Default email body text
    //let BODY = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks\r\n\r\n15 years ago, Satoshi mined the first block of the Bitcoin blockchain =\r\nAfter the Bitcoin white paper appeared on October 31, 2008, on a =\r\ncryptography mailing list, the Genesis Block =E2=80=94 the first bitcoin =\r\nblock and the basis of the entire Bitcoin trading system in place to =\r\nthis day =E2=80=94 was mined on January 3, 2009.=20\r\n\r\nThe Genesis Block is also known as Block 0 or Block 1, and is still in =\r\nthe Bitcoin network, where it will remain as long as there is a computer =\r\nrunning the Bitcoin software.=20\r\n\r\nAll nodes in the Bitcoin network can consult it, even if it is at the =\r\nother end of the network with hundreds of thousands of blocks.\r\n";
    
    /// @dev - Email body text, which includes a position and salary.
    //let BODY = "Dear Alice,\r\nWe are pleased to officially confirm your employment with AxBxC Corp. You will be joining us as a Senior Software Engineer, reporting to Bob David, starting on June 1.\r\nYour starting annual salary will be $100,000, payable on a annually basis, subject to standard deductions and withholdings. You will also be eligible for health insurance, as outlined in the employee handbook.\r\nWe’re excited to have you on board and look forward to seeing you grow with us. Please feel free to reach out if you have any questions before your start date.\r\nWelcome to the team!\r\nWarm regards,\r\nAlice Elisabeth\r\nSenior Software Engineer\r\nAxBxC Corp\r\ncontact@axbxc.com";

    /// @dev - Part of Email body text, which a salary part is extracted.
    let BODY = "Your starting annual salary will be $100,000"

    /// @dev - TEST
    //let BODY = "test.com"  // [Log]: 116,101,115,116,46,99,111,109

    return BODY;
}