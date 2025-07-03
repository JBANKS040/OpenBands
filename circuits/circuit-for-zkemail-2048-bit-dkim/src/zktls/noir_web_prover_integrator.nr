use noir_web_prover::{
    parser::Parser
};

use poseidon::poseidon::bn254::{hash_1, hash_2};


fn verify_http(polynomial_input: Field) {
    let self = Parser::default();
    Parser::digest(self, polynomial_input);
}