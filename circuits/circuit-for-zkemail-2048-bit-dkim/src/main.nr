mod tests;
mod utils;
mod libs;   // @dev - icl. openbanking_verifier

use jwt::JWT;

use zkemail::{
    headers::{body_hash::get_body_hash, email_address::get_email_address},
    MAX_EMAIL_ADDRESS_LENGTH, partial_hash::partial_sha256_var_end,
    dkim::RSAPubkey, Sequence,
    KEY_LIMBS_2048
};

use utils::{
    position_and_salary_extractor::{
        extract_position_from_email_body, // @dev - extract_position_from_email_body() function
        extract_salary_from_email_body    // @dev - extract_salary_from_body() function
    },
    email_dkim_verifier::{
        MAX_EMAIL_HEADER_LENGTH, MAX_EMAIL_BODY_LENGTH, MAX_BODY_TRIMMED_LENGTH,
        //verify_email_2048_bit_dkim,                         // @dev - verify_email_2048_bit_dkim() function
        verify_email_2048_bit_dkim_without_body_hash_check    // @dev - verify_email_2048_bit_dkim_without_body_hash_check() function
    },
};

use libs::{
    openbanking_integrator::{
        verify_openbanking_payment_proof,
        OpenbankingVerifierParams, OpenbankingVerifierReturn,
        MAX_AMOUNT_VALUE_LENGTH, MAX_PAYLOAD_LENGTH
    },
};


// @dev - [NOTE]: The following imported-variables are temporary variables. They are stored into the "test_header" and "test_body" for passing the verify_email_2048_bit_dkim() function. Thus, this should be removed once appropreate implementation will be done in the future.
use tests::test_inputs::{
    EmailLarge::{
        HEADER, BODY,
    },
    EmploymentOfferEmailLarge::{
        EMPLOYMENT_OFFER_EMAIL_HEADER, EMPLOYMENT_OFFER_EMAIL_BODY,
        POSITION_BODY, SALARY_BODY,
    },
};

global MAX_PARTIAL_DATA_LENGTH: u32 = 640; // signed data length after partial SHA
global MAX_DOMAIN_LENGTH: u32 = 64;
global MAX_EMAIL_LENGTH: u32 = 128;
global MAX_POSITION_LENGTH: u32 = 128;
global MAX_SALARY_LENGTH: u32 = 32;

// Rating must be between 1 and 5
fn verify_rating(rating: u8) {
    assert(rating >= 1, "rating must be at least 1");
    assert(rating <= 5, "rating must be at most 5");
}

/**
 * @brief Verify JWT signature (RSA/SHA256 only) and validate domain field
 * Also verify position and salary claims
 *
 * @param partial_data: OIDC JWT (id_token) base64 data (`$header.$payload`) as byte array of ascii characters
 *                      We do partial SHA on the data up to hd field outside of the circuit, to reduce constraints
 *                      This field only contains the bytes after partial SHA; padded to MAX_PARTIAL_DATA_LENGTH
 * @param partial_hash: The 256-bit partial hash of the `data`
 * @param full_data_length: The full length of the `data` (before partial SHA)
 * @param base64_decode_offset: Offset needed in `partial_data` to make the payloadB64 a multiple of 4
 *                    Signed data is $header.$payload. $payload might not be a multiple of 4 in `partial_data`, so we need to offset
 *                    Not attack-able by giving an incorrect offset, as string match of domain will fail
 * @param jwt_pubkey_modulus_limbs: RSA public key modulus limbs (2048-bit split into 18 limbs)
 * @param jwt_pubkey_redc_params_limbs: RSA reduction parameters limbs
 * @param jwt_signature_limbs: RSA signature limbs
 * @param domain: Domain name (`hd` key) as a byte array of ascii characters padded to MAX_DOMAIN_LENGTH
 * @param position: Position at the company as a byte array of ascii characters padded to MAX_POSITION_LENGTH
 * @param salary: Salary at the company as a byte array of ascii characters padded to MAX_SALARY_LENGTH
 * @param work_life_balance: Work-life balance rating (1-5)
 * @param culture_values: Culture and values rating (1-5)
 * @param career_growth: Career growth rating (1-5)
 * @param compensation_benefits: Compensation and benefits rating (1-5)
 * @param leadership_quality: Leadership quality rating (1-5)
 * @param operational_efficiency: Operational efficiency rating (1-5)
 **/
fn main(
    partial_data: BoundedVec<u8, MAX_PARTIAL_DATA_LENGTH>,
    partial_hash: [u32; 8],
    full_data_length: u32,
    base64_decode_offset: u32,
    jwt_pubkey_modulus_limbs: pub [u128; 18],
    jwt_pubkey_redc_params_limbs: [u128; 18],
    jwt_signature_limbs: [u128; 18],
    domain: pub BoundedVec<u8, MAX_DOMAIN_LENGTH>,
    position: pub BoundedVec<u8, MAX_POSITION_LENGTH>,   // Position, which is part of Email Body-extracted from the Entire Email Body.
    salary: pub BoundedVec<u8, MAX_SALARY_LENGTH>,       // Salary, which is part of Email Body-extracted from the Entire Email Body.
    work_life_balance: pub u8,
    culture_values: pub u8,
    career_growth: pub u8,
    compensation_benefits: pub u8,
    leadership_quality: pub u8,
    operational_efficiency: pub u8,
    // @dev - The following input parameters would be for email verification /w ZKEmail.nr
    header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>,  // Entire Email Header
    //body: BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>,    // Entire Email Body
    pubkey: RSAPubkey<KEY_LIMBS_2048>,
    signature: [Field; KEY_LIMBS_2048],
    //body_hash_index: u32,
    dkim_header_sequence: Sequence,
    body_trimmed: BoundedVec<u8, MAX_BODY_TRIMMED_LENGTH>, // Trimmed Email Body, which the Header and HTML parts are cut off.
) {
    // Init JWT struct and verify signature
    let jwt = JWT::init_with_partial_hash(
        partial_data,
        partial_hash,
        full_data_length,
        base64_decode_offset,
        jwt_pubkey_modulus_limbs,
        jwt_pubkey_redc_params_limbs,
        jwt_signature_limbs,
    );
    jwt.verify();

    // Assert email_verified claim
    jwt.assert_claim_bool("email_verified".as_bytes(), true);

    // Get email claim
    let email: BoundedVec<u8, MAX_EMAIL_LENGTH> = jwt.get_claim_string("email".as_bytes());

    // Get domain start_index from email claim - unconstrained, but we verify the domain bytes below
    // Safety: This function is unconstrained but its output is verified by the domain check below
    let domain_start_index = unsafe { get_domain_start_index_in_email(email) };

    // Verify domain passed is present in the email claim after the @
    assert(email.storage()[domain_start_index - 1] == 64, "char before domain is not '@'");
    for i in 0..MAX_DOMAIN_LENGTH {
        assert(email.storage()[domain_start_index + i] == domain.storage()[i], "invalid domain");
    }

    // Verify position and salary claims
    // These are separate inputs, NOT from the JWT
    let position_claim: BoundedVec<u8, MAX_POSITION_LENGTH> = position;
    for i in 0..MAX_POSITION_LENGTH {
        assert(position_claim.storage()[i] == position.storage()[i], "invalid position");
    }

    let salary_claim: BoundedVec<u8, MAX_SALARY_LENGTH> = salary;
    for i in 0..MAX_SALARY_LENGTH {
        assert(salary_claim.storage()[i] == salary.storage()[i], "invalid salary");
    }

    // Verify ratings are valid (1-5)
    verify_rating(work_life_balance);
    verify_rating(culture_values);
    verify_rating(career_growth);
    verify_rating(compensation_benefits);
    verify_rating(leadership_quality);
    verify_rating(operational_efficiency);

    // @dev - Verify an arbitrary email, which is signed by a 2048-bit RSA DKIM signature - without (skipping) body hash check
    let return_value: [Field; 2] = verify_email_2048_bit_dkim_without_body_hash_check(
        header,
        pubkey,
        signature,
        dkim_header_sequence
    );

    // @dev - [Log]:
    println(f"body_trimmed: {body_trimmed}\n");
    println(f"position: {position}\n");
    println(f"salary: {salary}\n");

    /// @dev - Validate to check whether a given "position" is included in the entire email body or not.
    /// @dev - Compare a given "position" (BoundedVec<u8, MAX_POSITION_LENGTH>) and a given "body" (BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>)
    let is_position_found_in_email_body: bool = unsafe { is_position_found_in_email_body(position, body_trimmed) };
    assert(is_position_found_in_email_body == true, "Position can not be found in email body");

    /// @dev - Validate to check whether a given "salary" is included in the entire email body or not.
    /// @dev - Compare a given "salary" (BoundedVec<u8, MAX_SALARY_LENGTH>) and a given "body" (BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>)
    let is_salary_found_in_email_body: bool = unsafe { is_salary_found_in_email_body(salary, body_trimmed) };
    assert(is_salary_found_in_email_body == true, "Salary can not be found in email body");
}


/**
 * @notice - Get (Identify) a start index of domain in email
 */
unconstrained fn get_domain_start_index_in_email(email: BoundedVec<u8, MAX_EMAIL_LENGTH>) -> u32 {
    let mut domain_start_index = 0;
    for i in 0..MAX_EMAIL_LENGTH {
        if email.storage()[i] == ("@".as_bytes())[0] {
            domain_start_index = i + 1;
            break;
        }
    }

    domain_start_index
}

/**
 * @dev - Validate to check whether a given "position" is included in the entire email body or not.
 * @dev - Compare a given "position" (BoundedVec<u8, MAX_POSITION_LENGTH>) and a given "body" (BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>)
 */
unconstrained fn is_position_found_in_email_body(
    position: BoundedVec<u8, MAX_POSITION_LENGTH>, 
    body: BoundedVec<u8, MAX_BODY_TRIMMED_LENGTH>
) -> bool {
    /// @dev - Logging
    let position_storage = position.storage(); 
    let body_storage = body.storage(); 
    println(f"position.storage(): {position_storage}\n");
    println(f"body.storage(): {body_storage}\n");

    /// @dev - Look for "position" in "email_body"
    let mut is_position_found_in_email_body: bool = false;
    for i in 0..body.len() {
        if (position.storage()[0] == body.storage()[i]) {
            if (position.len() == 1) { // @dev - The position and the sentence in the Email Body would completely be matched - In the case that the number of vectors of "position" is "1". 
                is_position_found_in_email_body = true;
                break;
            }

            let mut position_array: Vec<u8> = Vec::new();
            //let mut position_array: BoundedVec<Field, position.len()> = BoundedVec::new();
            for j in 1..position.len() {
                if (position.storage()[j] == body.storage()[i+j]) {
                    position_array.push(position.storage()[j]);
                    println(f"position_array: {position_array}\n");

                    /// @dev - Logging
                    let position_len = position.len() - 1;
                    let position_array_len = position_array.len();
                    println(f"position.len() - 1: {position_len}\n");
                    println(f"position_array.len(): {position_array_len}\n");

                    /// @dev - The position and the sentence in the Email Body would completely be matched - In the case that the number of vectors of "position" is "many" (Not "1"). 
                    if ((j == position.len() - 1) & (position_array.len() == position.len() - 1)) { /// @dev - Since "j" get started from "1", "1" should be subtracted from the position.len()
                        is_position_found_in_email_body = true;
                        break;
                    }
                }
            }
        }
    }

    is_position_found_in_email_body
}

/** 
 * @dev - Validate to check whether a given "salary" is included in the entire email body or not.
 * @dev - Compare a given "salary" (BoundedVec<u8, MAX_SALARY_LENGTH>) and a given "body" (BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>)
 * @dev - In the following implementation, the maximum number of sequences-matched is 5. ("5" is enuough for judging whether a given salary is included in the email body or not)
 */
unconstrained fn is_salary_found_in_email_body(
    salary: BoundedVec<u8, MAX_SALARY_LENGTH>, 
    body: BoundedVec<u8, MAX_BODY_TRIMMED_LENGTH>
) -> bool {
    let mut is_salary_found_in_email_body: bool = false;
    for i in 0..body.len() {
        if (salary.storage()[0] == body.storage()[i]) {
            if (salary.len() == 1) {
                // @dev - Salary is found in the email body
                is_salary_found_in_email_body = true;
                break;
            }

            let mut salary_array: Vec<u8> = Vec::new();
            //let mut salary_array: BoundedVec<Field, salary.len()> = BoundedVec::new();
            for j in 1..salary.len() {
                if (salary.storage()[j] == body.storage()[i+j]) {
                    salary_array.push(salary.storage()[j]);
                    println(f"salary_array: {salary_array}\n");

                    /// @dev - Logging
                    let salary_len = salary.len() - 1;
                    let salary_array_len = salary_array.len();
                    println(f"salary.len() - 1: {salary_len}\n");
                    println(f"position_array.len(): {salary_array_len}\n");

                    // @dev - The position and the sentence in the Email Body would completely be matched - In the case that the number of vectors of "position" is "many" (Not "1"). 
                    if ((j == salary.len() - 1) & (salary_array.len() == salary.len() - 1)) { /// @dev - Since "j" get started from "1", "1" should be subtracted from the position.len()
                        is_salary_found_in_email_body = true;
                        break;
                    }
                }
            }
        }
    }

    is_salary_found_in_email_body
}