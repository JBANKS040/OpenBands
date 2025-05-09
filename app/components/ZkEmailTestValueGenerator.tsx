import { getEmailHeaderInUint8Array, getEmailBodyInUint8Array, getRSAPubkey, getSignature, getBodyHashIndex, getDkimHeaderSequence } from "./test-input-data/inputDataInUint8ArrayGenerator.tsx";

// @dev - Input parameters for email verification /w ZKEmail.nr
//export type ZkEmailTestValues = {
interface ZkEmailTestValues {
  header: BoundedVec,  // Entire Email Header
  body: BoundedVec,      // Entire Email Body
  pubkey: {
    modulus: string[];
    redc: string[];
  },
  signature: string[],
  body_hash_index: string,
  dkim_header_sequence: Sequence
}

export type Sequence = {
  index: string;
  length: string;
};

export type BoundedVec = {
  storage: string[];
  len: string;
};


export default function getZkEmailTestValues(): ZkEmailTestValues {
  
  const HEADER = getEmailHeaderInUint8Array();
  const BODY = getEmailBodyInUint8Array();
  const RSA_PUBKEY = getRSAPubkey();
  const SIGNATURE = getSignature();
  const BODY_HASH_INDEX = getBodyHashIndex();
  const DKIM_HEADER_SEQUENCE = getDkimHeaderSequence();

  const header = new Uint8Array(HEADER);
  const body = new Uint8Array(BODY);
  const pubkey = {
    modulus: new Array(RSA_PUBKEY.MODULUS),
    redc: new Array(RSA_PUBKEY.REDC)
  };
  const signature = new Array(SIGNATURE);
  const body_hash_index = BODY_HASH_INDEX;
  const dkim_header_sequence = new Sequence(DKIM_HEADER_SEQUENCE);

  const zkEmailTestValues: ZkEmailTestValuesProps = {
    header,
    body,
    pubkey,
    signature,
    body_hash_index,
    dkim_header_sequence
  };

  return zkEmailTestValues;
}