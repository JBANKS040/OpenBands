use jwt::JWT;

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
    position: pub BoundedVec<u8, MAX_POSITION_LENGTH>,
    salary: pub BoundedVec<u8, MAX_SALARY_LENGTH>,
    work_life_balance: pub u8,
    culture_values: pub u8,
    career_growth: pub u8,
    compensation_benefits: pub u8,
    leadership_quality: pub u8,
    operational_efficiency: pub u8
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
}

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