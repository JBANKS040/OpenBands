use openbanking_verifier::{
    verify::{verify_openbanking_payment},
    io::{OpenbankingVerifierParams, OpenbankingVerifierReturn}
};


/**
 * @notice - Verify an Openbanking payment with some custom logic.
 */
fn verify_openbanking_payment(
    params: OpenbankingVerifierParams
) -> pub OpenbankingVerifierReturn {
    // @dev - [TODO]: Add some custom logic here.

    // @dev - openbanking_verifier::verify_openbanking_payment()
    verify_openbanking_payment(params)
}