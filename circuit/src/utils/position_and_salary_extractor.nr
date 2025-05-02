use std::hash::pedersen_hash;

use zkemail::{
    KEY_LIMBS_2048, dkim::RSAPubkey, headers::body_hash::get_body_hash,
    partial_hash::partial_sha256_var_end
};


/**
 * @notice - This function extracts a position from the email body.
 */
pub fn extract_position_from_email_body(email_body: Field) -> Field {}

/**
 * @notice - This function extracts a salary from the email body.
 */
pub fn extract_salary_from_email_body(email_body: Field) -> Field {}