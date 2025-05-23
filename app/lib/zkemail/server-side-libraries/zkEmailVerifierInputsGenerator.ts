/// @notice - To call the following functions, the "next.config.mjs" file (icl. "webpack" setting) must be set in the ./app directory in order to allow to run the "node" environment on client-side and prevent from the "node::buffer" error on client-side.
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";

export const MAX_HEADER_LENGTH = 1504;
export const MAX_BODY_LENGTH = 32000;
export const MAX_BODY_TRIMMED_LENGTH = 2048;

export const KEY_LIMBS_1024_LENGTH = 9;
export const KEY_LIMBS_2048_LENGTH = 18;

//export const EMPTY_KEY_LIMBS_1024 = new Uint8Array(KEY_LIMBS_1024_LENGTH);
//export const EMPTY_KEY_LIMBS_1024 = Uint8Array.from(["", "", "", "", "", "", "", "", ""]);
//export const EMPTY_KEY_LIMBS_1024 = ["0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x"];
export const EMPTY_KEY_LIMBS_1024 = [    // @dev - Dummy value (Source: noir-rsa library)
    "0x8d5e7d9daedd6cfd1c9bdf0227e05b",
    "0xbfb937fc4d3cf02cc0af780f3cab44",
    "0xd20637ef7adcf5d238ee87bccc9bca",
    "0xb9db4f2663108e2f8b673f7612ae8b",
    "0x85f894ef669b36bfd3d86b0a28873",
    "0xdcc70e1884e38b8229cce3b884121d",
    "0x35488d1138e0b03e1676f7f5d8a5b3",
    "0xe1a97820e7dcbb4eab35c9b71bb273",
    "0x97d19eb3c63249ddbfcff915863f54",
]

//export const EMPTY_KEY_LIMBS_2048 = new Uint8Array(KEY_LIMBS_2048_LENGTH);
//export const EMPTY_KEY_LIMBS_2048 = Uint8Array.from(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
//export const EMPTY_KEY_LIMBS_2048 = ["0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x", "0x"];
export const EMPTY_KEY_LIMBS_2048 = [   // @dev - Dummy value (Source: noir-rsa library)
    "0x8d5e7d9daedd6cfd1c9bdf0227e05b",
    "0xbfb937fc4d3cf02cc0af780f3cab44",
    "0xd20637ef7adcf5d238ee87bccc9bca",
    "0xb9db4f2663108e2f8b673f7612ae8b",
    "0x85f894ef669b36bfd3d86b0a28873",
    "0xdcc70e1884e38b8229cce3b884121d",
    "0x35488d1138e0b03e1676f7f5d8a5b3",
    "0xe1a97820e7dcbb4eab35c9b71bb273",
    "0x97d19eb3c63249ddbfcff915863f54",
    "0x3a78c7af6da0f6af0d67b1ca4b6065",
    "0xd7a3c433c020f624821e5e678c7d69",
    "0x52d5b53240feae82ffea3d2a3d9b09",
    "0xb8aad5e19e2163f68997c6fdd71906",
    "0x5db432d06e8b0bf59511100c7894e2",
    "0xadc0bbc4c54da10d1cc88438ea3127",
    "0xece1cf6a1501109cd2734d5893c8d9",
    "0x7196b90acdf06c31b1288064fd0c27",
    "0xc8",
]


/**
 * @description - This function is used to generate the inputs for the zkEmail based verifier circuit.
 * @param rawEmail - The raw email text, which is extracted from a EML file (.eml file)
 */
export async function generateZkEmailVerifierInputs(
    rawEmail: string,
    //rawEmail: Buffer | string,
    //params: InputGenerationArgs = {}
): Promise<{ zkEmailInputs: any }> {
    const zkEmailInputs = await generateEmailVerifierInputs(rawEmail, {
        maxBodyLength: 32000,     // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit
        //maxBodyLength: 1280,    // Same as MAX_PARTIAL_EMAIL_BODY_LENGTH in circuit (NOTE: This is the original value)
        maxHeadersLength: 1504,   // Same as MAX_EMAIL_HEADER_LENGTH in circuit
        //maxHeadersLength: 1408, // Same as MAX_EMAIL_HEADER_LENGTH in circuit (NOTE: This is the original value)
        shaPrecomputeSelector: "",
        //shaPrecomputeSelector: "Content-Type: text/html",
        //shaPrecomputeSelector: "some string in body up to which you want to hash outside circuit",
    });
    //console.log(`zkEmailInputs: ${ JSON.stringify(zkEmailInputs, null, 2) }`);

    return { zkEmailInputs };
}

/**
 * @description Generate a dkimResult from raw email content, which is extracted from a EML file (.eml file)
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