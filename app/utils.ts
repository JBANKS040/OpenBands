//import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr";
//import { generateEmailVerifierInputs } from "@mach-34/zkemail-nr";

export async function generateZkEmailInputsFromEmlFile(
  emailContent: string
  //walletAddress: string
): Promise<{ inputs: any }> {
  try {
    //const walletAddressField = BigInt(walletAddress).toString();

    // Generate common inputs using ZK Email SDK
    const zkEmailInputs = await generateEmailVerifierInputs(emailContent, {
      maxBodyLength: 64000,     // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit
      //maxBodyLength: 1280,    // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit
      maxHeadersLength: 2048,   // Same as MAX_EMAIL_HEADER_LENGTH in circuit
      //maxHeadersLength: 1408, // Same as MAX_EMAIL_HEADER_LENGTH in circuit
      shaPrecomputeSelector: "", // <img to pick the one in html part
      //shaPrecomputeSelector: "you authored the thread.<img", // <img to pick the one in html part
    });

    const emailDetails = parseEmail(emailContent);

    // Pad repo name to 50 bytes
    const repoNamePadded = new Uint8Array(50);
    repoNamePadded.set(
      Uint8Array.from(new TextEncoder().encode(emailDetails.repoName))
    );

    // Pad pr number to 6 bytes
    // We need this to compute the "target": url
    const prNumberPadded = new Uint8Array(6);
    prNumberPadded.set(
      Uint8Array.from(new TextEncoder().encode(emailDetails.prNumber))
    );

    // Pad email address to 60 bytes
    const emailAddressPadded = new Uint8Array(60);
    emailAddressPadded.set(
      Uint8Array.from(new TextEncoder().encode(emailDetails.ccEmail))
    );

    // Partial body padded
    const partialBodyPadded = new Array(1280).fill(0);
    for (let i = 0; i < zkEmailInputs.body!.length; i++) {
      partialBodyPadded[i] = zkEmailInputs.body![i];
    }

    const headerPadded = new Array(1408).fill(0);
    for (let i = 0; i < zkEmailInputs.header.length; i++) {
      headerPadded[i] = zkEmailInputs.header[i];
    }

    const inputs = {
      ...zkEmailInputs,
      header: headerPadded,
      header_length: zkEmailInputs.header_length,
      partial_body: Array.from(partialBodyPadded).map((s) => s.toString()),
      partial_body_length: zkEmailInputs.partial_body_length,
      full_body_length: zkEmailInputs.body_length,
      partial_body_hash: zkEmailInputs.partial_body_hash,
      body_hash_index: zkEmailInputs.body_hash_index,
      pubkey: zkEmailInputs.pubkey,
      pubkey_redc: zkEmailInputs.pubkey_redc,
      signature: zkEmailInputs.signature,
      repo_name: Array.from(repoNamePadded).map((s) => s.toString()),
      repo_name_length: emailDetails.repoName.length,
      pr_number: Array.from(prNumberPadded).map((s) => s.toString()),
      pr_number_length: emailDetails.prNumber.length,
      email_address: Array.from(emailAddressPadded).map((s) => s.toString()),
      email_address_length: emailDetails.ccEmail.length,
      wallet_address: ""
      //wallet_address: walletAddressField,
    };
    console.log("Generating the zkEmail inputs:", inputs);
  
    return { inputs };
  } catch (error) {
    console.error("Error :", error);
    throw new Error("Failed to generate the zkEmail inputs");
  }
}


export function parseEmail(emlContent: string) {
  // Extract PR URL - between `"target": "` and `#event-`
  const targetUrlMatch = emlContent.match(/"target": "(.*?)event-/);
  const targetUrl = targetUrlMatch ? targetUrlMatch[1] : "";

  // Parse repo name from PR URL
  const repoNameMatch = targetUrl.match(/https:\/\/github\.com\/(.*?)\/pull\//);
  const repoName = repoNameMatch ? repoNameMatch[1] : "";

  const prNumberMatch = targetUrl.match(/\/pull\/(.*?)#/);
  const prNumber = prNumberMatch ? prNumberMatch[1] : "";

  const ccEmailMatch = emlContent.match(/Cc: (.*),/);
  const ccEmail = ccEmailMatch ? ccEmailMatch[1] : "";

  return {
    repoName,
    prNumber,
    ccEmail,
  };
}