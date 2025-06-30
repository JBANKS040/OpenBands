use std::{collections::bounded_vec::BoundedVec, hash::{pedersen_hash}};
//use std::{collections::bounded_vec::BoundedVec, hash::{pedersen_hash, sha256_var}};

use zkemail::{
    dkim::RSAPubkey, 
    headers::body_hash::get_body_hash, 
    KEY_LIMBS_2048, 
    Sequence
};

global MAX_EMAIL_HEADER_LENGTH: u32 = 1504;
//global MAX_EMAIL_HEADER_LENGTH: u32 = 512;
global MAX_EMAIL_BODY_LENGTH: u32 = 32000;
//global MAX_EMAIL_BODY_LENGTH: u32 = 1024;

global MAX_BODY_TRIMMED_LENGTH: u32 = 2048;


/**
 * Verify an arbitrary email signed by a 2048-bit RSA DKIM signature - without (skipping) body hash check
 * @dev TOTAL CONSTRAINTS: ~222,783
 *
 * @param header - The email header, 0-padded at end to the MAX_EMAIL_HEADER_LENGTH
 * @param pubkey - The DKIM RSA Public Key modulus and reduction parameter
 * @param signature - The DKIM RSA Signature
 * @param dkim_header_sequence - The index and length of the DKIM header field
 * @return - 
 *         0: Pedersen hash of DKIM public key (root of trust)
 *         1: Pedersen hash of DKIM signature (email nullifier)
 */
fn verify_email_2048_bit_dkim_without_body_hash_check(
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    dkim_header_sequence: Sequence,
) -> [Field; 2] {        // @dev - Since Noir (Nargo) version v1.0.0, the `pub` keyword can not be used for the return value of the internal function.   
//) -> pub [Field; 2] {
    // check the body and header lengths are within bounds
    assert(header.len() <= MAX_EMAIL_HEADER_LENGTH);

    // ~ 86,553 constraints
    // verify the dkim signature over the header
    pubkey.verify_dkim_signature(header, signature);

    // ~ 10,255 constraints
    // hash the pubkey and signature for the standard outputs
    let email_nullifier = pedersen_hash(signature);
    [pubkey.hash(), email_nullifier]
}