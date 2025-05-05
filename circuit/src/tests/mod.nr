pub(crate) mod test_inputs;


mod test_zkemail_integration_success {

    use crate::{
        MAX_PARTIAL_DATA_LENGTH, MAX_DOMAIN_LENGTH, MAX_POSITION_LENGTH, MAX_SALARY_LENGTH,    // main.nr
        utils::email_2048_bit_dkim_verifier::{MAX_EMAIL_BODY_LENGTH, MAX_EMAIL_HEADER_LENGTH},        
        tests::test_inputs::{EmailLarge}
    };

    use zkemail::{
        headers::{body_hash::get_body_hash, email_address::get_email_address},
        MAX_EMAIL_ADDRESS_LENGTH, partial_hash::partial_sha256_var_end,
        dkim::RSAPubkey, KEY_LIMBS_2048, Sequence
    };

    use std::hash::sha256_var;

    #[test]
    fn test_verify_position_and_salary_and_verify_email_2048_bit_dkim() {

        let partial_data: BoundedVec<u8, MAX_PARTIAL_DATA_LENGTH>;
        let partial_hash: [u32; 8];
        let full_data_length: u32;
        let base64_decode_offset: u32;
        let jwt_pubkey_modulus_limbs: [u128; 18];
        let jwt_pubkey_redc_params_limbs: [u128; 18];
        let jwt_signature_limbs: [u128; 18];
        let domain: BoundedVec<u8, MAX_DOMAIN_LENGTH>;
        let position: BoundedVec<u8, MAX_POSITION_LENGTH>;
        let salary: BoundedVec<u8, MAX_SALARY_LENGTH>;
        let work_life_balance: u8 = 5;
        let culture_values: u8 = 4;
        let career_growth: u8 =3;
        let compensation_benefits: u8 = 5;
        let leadership_quality: u8 = 4;
        let operational_efficiency: u8 = 3;

        // @dev - Input parameters for email verification /w ZKEmail.nr
        let header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH>;  // Entire Email Header
        let body: BoundedVec<u8, MAX_EMAIL_BODY_LENGTH>;      // Entire Email Body
        let pubkey: RSAPubkey<KEY_LIMBS_2048>;
        let signature: [Field; KEY_LIMBS_2048];
        let body_hash_index: u32;
        let dkim_header_sequence: Sequence;
 

    }
}


mod test_zkemail_modules_success {

    use crate::{
        main,
        tests::test_inputs::EmailLarge
    };

    use zkemail::{
        headers::{body_hash::get_body_hash, email_address::get_email_address},
        MAX_EMAIL_ADDRESS_LENGTH, partial_hash::partial_sha256_var_end,
        dkim::RSAPubkey, KEY_LIMBS_2048, Sequence
    };

    use std::hash::sha256_var;

    #[test]
    fn test_dkim_signature() {
        EmailLarge::PUBKEY.verify_dkim_signature(EmailLarge::HEADER, EmailLarge::SIGNATURE);
    }

    #[test]
    fn test_body_hash() {
        // get the body hash from the header
        let signed_body_hash = get_body_hash(
            EmailLarge::HEADER,
            EmailLarge::DKIM_HEADER_SEQUENCE,
            EmailLarge::BODY_HASH_INDEX,
        );
        // compute the body hash
        let computed_body_hash: [u8; 32] =
            sha256_var(EmailLarge::BODY.storage(), EmailLarge::BODY.len() as u64);
        // compare the body hashes
        assert(
            signed_body_hash == computed_body_hash,
            "SHA256 hash computed over body does not match body hash found in DKIM-signed header",
        );
    }

    #[test]
    fn test_partial_hash() {
        // get the body hash from the header
        let signed_body_hash = get_body_hash(
            EmailLarge::HEADER,
            EmailLarge::DKIM_HEADER_SEQUENCE,
            EmailLarge::BODY_HASH_INDEX,
        );
        // finish the partial hash
        let computed_body_hash = partial_sha256_var_end(
            EmailLarge::PARTIAL_BODY_HASH,
            EmailLarge::PARTIAL_BODY.storage(),
            EmailLarge::PARTIAL_BODY.len() as u64,
            EmailLarge::PARTIAL_BODY_REAL_LENGTH as u64,
        );
        // compare the body hashes
        assert(
            signed_body_hash == computed_body_hash,
            "Sha256 hash computed over body does not match DKIM-signed header",
        );
    }

    #[test]
    fn test_address_extraction() {
        let from = comptime { "from".as_bytes() };
        let to = comptime { "to".as_bytes() };
        // 16k gate cost? has to be able to be brought down
        let from_address = get_email_address(
            EmailLarge::HEADER,
            EmailLarge::FROM_HEADER_SEQUENCE,
            EmailLarge::FROM_ADDRESS_SEQUENCE,
            from,
        );
        let to_address = get_email_address(
            EmailLarge::HEADER,
            EmailLarge::TO_HEADER_SEQUENCE,
            EmailLarge::TO_ADDRESS_SEQUENCE,
            to,
        );
        let expected_from_address: BoundedVec<u8, MAX_EMAIL_ADDRESS_LENGTH> =
            BoundedVec::from_array("runnier.leagues.0j@icloud.com".as_bytes());
        let expected_to_address: BoundedVec<u8, MAX_EMAIL_ADDRESS_LENGTH> =
            BoundedVec::from_array("zkewtest@gmail.com".as_bytes());
        assert_eq(
            expected_from_address,
            from_address,
            "From address does not match expected address",
        );
        assert_eq(expected_to_address, to_address, "To address does not match expected address");
    }
}




//mod test_tampered_hash {}
//mod test_header_field_access {}
//mod test_address_extraction {}