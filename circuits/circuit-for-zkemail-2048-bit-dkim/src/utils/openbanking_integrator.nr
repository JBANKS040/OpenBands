// @dev - ref: openbanking.nr-circuit/src/main.nr
use dep::openbanking_verifier::{
    constants::{MAX_AMOUNT_VALUE_LENGTH, MAX_PAYLOAD_LENGTH,},
    verify::verify_openbanking_payment,
    io::{OpenbankingVerifierParams, OpenbankingVerifierReturn}
};


/**
 * @notice - Verify an Openbanking payment with some custom logic.
 */
fn verify_openbanking_payment_proof(
    params: OpenbankingVerifierParams
) -> pub OpenbankingVerifierReturn {
    // @dev - [TODO]: Add some custom logic here.

    // @dev - openbanking_verifier::verify_openbanking_payment()
    verify_openbanking_payment(params)
}