// @dev - ref: openbanking.nr-circuit/src/main.nr
use openbanking_verifier::{
    verify::verify_openbanking_payment,
    io::{OpenbankingVerifierParams, OpenbankingVerifierReturn}, 
    constants::{MAX_AMOUNT_VALUE_LENGTH, MAX_PAYLOAD_LENGTH}
};


/**
 * @notice - Verify an Openbanking payment with some custom logic.
 */
fn verify_openbanking_payment_proof(
    params: OpenbankingVerifierParams
) -> OpenbankingVerifierReturn {
    // @dev - [TODO]: Add some custom logic here.

    // @dev - Return value in the form of the OpenbankingVerifierReturn struct data.
    verify_openbanking_payment(params)  // @dev - openbanking_verifier::verify_openbanking_payment() is called here.
}