pub(crate) mod test_inputs;


/**
 * @notice - The circuit test of zkEmail integration
 */
mod test_zkemail_integration_success {

    use crate::{
        main, MAX_PARTIAL_DATA_LENGTH, MAX_DOMAIN_LENGTH, MAX_POSITION_LENGTH, MAX_SALARY_LENGTH,  // main.nr
        utils::email_dkim_verifier::{MAX_EMAIL_BODY_LENGTH, MAX_EMAIL_HEADER_LENGTH},        
        tests::test_inputs::{
            EmailLarge::{
                PUBKEY, SIGNATURE, BODY_HASH_INDEX, DKIM_HEADER_SEQUENCE,
            }, 
            EmploymentOfferEmailLarge::{
                EMPLOYMENT_OFFER_EMAIL_HEADER, EMPLOYMENT_OFFER_EMAIL_BODY,
                POSITION_BODY, SALARY_BODY,
            },
        }
    };

    use zkemail::{
        headers::{body_hash::get_body_hash, email_address::get_email_address},
        MAX_EMAIL_ADDRESS_LENGTH, partial_hash::partial_sha256_var_end,
        dkim::RSAPubkey, Sequence,
        KEY_LIMBS_1024,
        KEY_LIMBS_2048
    };

    use std::hash::sha256_var;

    #[test]
    fn test_verify_position_and_salary_and_verify_email_2048_bit_dkim() {

        let partial_data: BoundedVec<u8, MAX_PARTIAL_DATA_LENGTH> = BoundedVec::from_array([106, 98, 50, 48, 105, 76, 67, 74, 122, 100, 87, 73, 105, 79, 105, 74, 66, 81, 107, 78, 69, 77, 84, 73, 122, 77, 84, 73, 122, 73, 105, 119, 105, 90, 87, 49, 104, 97, 87, 120, 102, 100, 109, 86, 121, 97, 87, 90, 112, 90, 87, 81, 105, 79, 110, 82, 121, 100, 87, 85, 115, 73, 109, 53, 118, 98, 109, 78, 108, 73, 106, 111, 105, 77, 84, 73, 122, 77, 84, 73, 122, 77, 84, 73, 122, 73, 105, 119, 105, 90, 87, 49, 104, 97, 87, 119, 105, 79, 105, 74, 104, 98, 71, 108, 106, 90, 85, 66, 48, 90, 88, 78, 48, 76, 109, 78, 118, 98, 83, 73, 115, 73, 109, 108, 104, 100, 67, 73, 54, 77, 84, 99, 122, 78, 122, 89, 48, 77, 106, 73, 120, 78, 121, 119, 105, 89, 88, 86, 107, 73, 106, 111, 105, 77, 84, 73, 122, 77, 84, 73, 122, 77, 84, 73, 122, 76, 106, 81, 49, 78, 106, 81, 49, 78, 106, 81, 49, 78, 105, 73, 115, 73, 109, 86, 52, 99, 67, 73, 54, 77, 84, 99, 53, 79, 84, 107, 53, 79, 84, 107, 53, 79, 88, 48]);
        let partial_hash: [u32; 8] = [2065651337, 2814693704, 862745553, 2384319000, 1412758034, 3553265356, 3156727610, 4160738201];
        let full_data_length: u32 = 268;
        let base64_decode_offset: u32 = 1;
        let jwt_pubkey_modulus_limbs: [u128; 18] = [484791102317025465533947056954494751, 689128460766062759582134715581990032, 810523707777777878428965619663888709, 184404549238669475316963116864788898, 93466218048229154672139102341852900, 584828628768888069086079532464056431, 97425187031931427039620311245463762, 26273806718910063326353308419294998, 788747954066548540615875263034804664, 889704621954975151388848797463892494, 311999144542197118282319553447935979, 569776388981460921496753063185331362, 903966640703701959992132828577771898, 159022820921763067563807580152706463, 503819859541011037194389727017199051, 1078173269124751507098806957834900664, 808018922828293630146825008649069450, 163];
        let jwt_pubkey_redc_params_limbs: [u128; 18] = [1143167338325541577958669340190596824, 782066667103526839077340987159104121, 1067845759344375818181746341911682002, 880124617802511701465844415806808588, 285259139341669707856057706066903101, 1230850420220071595120007854793337041, 243441877489860292941608721967510056, 821283804950244931298352888469271304, 265590023859021620015146340457966193, 955602690275722281613949658760787989, 704159826142581942518373637894303280, 313938418637521056314346970388282852, 296174013877567499290252280618882959, 127533166408087917092441034792304239, 486694435757811118946661778147879193, 742440511645057019411661928820777129, 106100992772450627263374716203348785, 6409];
        let jwt_signature_limbs: [u128; 18] = [782421962573548264472674190647943355, 528649442614902878048130358901749842, 795671681115216636642039527621785323, 342055983261463759066440970886912343, 320943042314824191484469254030368420, 233931545977215775766660875366648712, 166738968145911552289782464945436391, 1280090914380823160665554635957223606, 225322564371992173705155119766257284, 1012067778676730712845356243167441596, 337008035250054394089555850701430953, 441480997772890594691718538441538925, 1266099611422563733802354067242028554, 163890419575820619684088542045789366, 71236811945264458762129145425586273, 106105739687938386497215871288359508, 598323717706499880526430558338637686, 97];
        let domain: BoundedVec<u8, MAX_DOMAIN_LENGTH> = BoundedVec::from_array([116,101,115,116,46,99,111,109]); // "test.com"
        let position: BoundedVec<u8, MAX_POSITION_LENGTH> = POSITION_BODY;                  // Position Body, which is extracted from the Email Body
        let salary: BoundedVec<u8, MAX_SALARY_LENGTH> = SALARY_BODY;                        // Salary Body, which is extracted from the Email Body
        let work_life_balance: u8 = 5;
        let culture_values: u8 = 4;
        let career_growth: u8 = 3;
        let compensation_benefits: u8 = 5;
        let leadership_quality: u8 = 4;
        let operational_efficiency: u8 = 3;

        // @dev - Input parameters for email verification /w ZKEmail.nr
        let header: BoundedVec<u8, MAX_EMAIL_HEADER_LENGTH> = EMPLOYMENT_OFFER_EMAIL_HEADER;  // Entire Email Header
        //let body: BoundedVec<u8, MAX_EMAIL_BODY_LENGTH> = EMPLOYMENT_OFFER_EMAIL_BODY;        // Entire Email Body
        //let pubkey: RSAPubkey<KEY_LIMBS_1024> = PUBKEY;             // RSA Public Key (1024-bit)
        //let pubkey: RSAPubkey<KEY_LIMBS_2048> = PUBKEY;           // RSA Public Key (2048-bit)
        //let signature: [Field; KEY_LIMBS_1024] = SIGNATURE;         // RSA Signature (1024-bit)
        //let signature: [Field; KEY_LIMBS_2048] = SIGNATURE;       // RSA Signature (2048-bit)
        //let body_hash_index: u32 = BODY_HASH_INDEX;               // Index of the body hash in the DKIM-signed header
        let dkim_header_sequence: Sequence = DKIM_HEADER_SEQUENCE;  // DKIM header sequence
 
        // @dev - Run the main function (ZK circuit) with the input parameters above.
    //     main(
    //         partial_data,
    //         partial_hash,
    //         full_data_length,
    //         base64_decode_offset,
    //         jwt_pubkey_modulus_limbs,
    //         jwt_pubkey_redc_params_limbs,
    //         jwt_signature_limbs,
    //         domain,
    //         position,
    //         salary,
    //         work_life_balance,
    //         culture_values,
    //         career_growth,
    //         compensation_benefits,
    //         leadership_quality,
    //         operational_efficiency,

    //         // @dev - Input parameters for email verification /w ZKEmail.nr
    //         header,
    //         //body,
    //         pubkey,
    //         signature,
    //         //body_hash_index,
    //         dkim_header_sequence
    //     );
    }
}


/**
 * @notice - The default circuit test of the zkEmail.nr
 */
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