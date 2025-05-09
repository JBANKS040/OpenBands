// import { 
//   getEmailHeaderInUint8Array, 
//   getEmailBodyInUint8Array, 
//   getRSAPubkey, 
//   getSignature, 
//   getBodyHashIndex, 
//   getDkimHeaderSequence 
// } from "./test-input-data/inputDataInUint8ArrayGenerator";

import { 
  getEmailHeaderInString, 
  getEmailBodyInString, 
  getRSAPubkey, 
  getSignature, 
  getBodyHashIndex, 
  getDkimHeaderSequence 
} from "./test-input-data/inputDataInStringGenerator";


export const MAX_HEADER_LENGTH = 512;
export const MAX_BODY_LENGTH = 1024;
// pub(crate) global EMAIL_LARGE_MAX_HEADER_LENGTH: u32 = 512;
// pub(crate) global EMAIL_LARGE_MAX_BODY_LENGTH: u32 = 1024;


// @dev - Input parameters for email verification /w ZKEmail.nr
//export type ZkEmailTestValues = {
interface ZkEmailTestValues {
  header: string,
  //header: BoundedVec,  // Entire Email Header
  body: string,
  //body: BoundedVec,    // Entire Email Body
  pubkey: {
    modulus: string[];
    redc: string[];
  },
  signature: string[],
  body_hash_index: number,
  dkim_header_sequence: {
    index: number;
    length: number;
  }
  //dkim_header_sequence: Sequence
}

// export interface Sequence {
//   index: string;
//   length: string;
// };

// export interface BoundedVec {
//   storage: string[];
//   len: string;
// };

export async function getZkEmailTestValues() {
  const HEADER = getEmailHeaderInString();
  //const HEADER = getEmailHeaderInUint8Array();
  const BODY = getEmailBodyInString();
  //const BODY = getEmailBodyInUint8Array();
  const RSA_PUBKEY = getRSAPubkey();
  const SIGNATURE = getSignature();
  const BODY_HASH_INDEX = getBodyHashIndex();
  const DKIM_HEADER_SEQUENCE = getDkimHeaderSequence();

  const header = HEADER;
  //const header = new Uint8Array(HEADER);
  const body = BODY;
  //const body = new Uint8Array(BODY);
  const pubkey = {
    modulus: RSA_PUBKEY.MODULUS,
    redc: RSA_PUBKEY.REDC
  };
  const signature = SIGNATURE;
  const body_hash_index = BODY_HASH_INDEX;
  const dkim_header_sequence = { index: DKIM_HEADER_SEQUENCE.INDEX, length: DKIM_HEADER_SEQUENCE.LENGTH };

  const zkEmailTestValues: ZkEmailTestValues = {
    header,
    body,
    pubkey,
    signature,
    body_hash_index,
    dkim_header_sequence
  };

  return zkEmailTestValues;
}


// export default function getZkEmailTestValues(): ZkEmailTestValues {
  
//   const HEADER = getEmailHeaderInUint8Array();
//   const BODY = getEmailBodyInUint8Array();
//   const RSA_PUBKEY = getRSAPubkey();
//   const SIGNATURE = getSignature();
//   const BODY_HASH_INDEX = getBodyHashIndex();
//   const DKIM_HEADER_SEQUENCE = getDkimHeaderSequence();

//   const header = new Uint8Array(HEADER);
//   const body = new Uint8Array(BODY);
//   const pubkey = {
//     modulus: new Array(RSA_PUBKEY.MODULUS),
//     redc: new Array(RSA_PUBKEY.REDC)
//   };
//   const signature = new Array(SIGNATURE);
//   const body_hash_index = BODY_HASH_INDEX;
//   const dkim_header_sequence = new Sequence(DKIM_HEADER_SEQUENCE);

//   const zkEmailTestValues: ZkEmailTestValues = {
//     header,
//     body,
//     pubkey,
//     signature,
//     body_hash_index,
//     dkim_header_sequence
//   };

//   return zkEmailTestValues;
// }