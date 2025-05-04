pub(crate) mod test_inputs;

mod test_success {

    use crate::{
        main;
        zkemail::{
            headers::{body_hash::get_body_hash, email_address::get_email_address},
            MAX_EMAIL_ADDRESS_LENGTH,
            partial_hash::partial_sha256_var_end,

            dkim::RSAPubkey,
            KEY_LIMBS_2048, 
            Sequence
        }
        tests::test_inputs::EmailLarge
    };

    use std::hash::sha256_var;

    #[test]
    fn test_dkim_signature() {
        EmailLarge::PUBKEY.verify_dkim_signature(EmailLarge::HEADER, EmailLarge::SIGNATURE);
    }

}




//mod test_tampered_hash {}
//mod test_header_field_access {}
//mod test_address_extraction {}