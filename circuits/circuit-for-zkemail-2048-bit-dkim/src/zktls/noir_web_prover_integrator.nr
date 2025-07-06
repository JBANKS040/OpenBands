use noir_web_prover::{
    parser::Parser,
    setup::SetupState
};

use poseidon::poseidon::bn254::{hash_1, hash_2};


fn verify_http(
    response_plaintext_bytes: [u8; 320],
    line_digests: [Field; 10],
    polynomial_input: Field
) {
    let machine_state = Parser::default(); // @dev - This "machine_state" is also called the "Self" as well.
    Parser::digest(machine_state, polynomial_input);

    let setup = SetupState { data: response_plaintext_bytes, line_digests, polynomial_input };

    let step_in: [Field; 11] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // [TODO]: Should be replaced with an actual input values
    
    let step_out = setup.verify(step_in, machine_state);
}