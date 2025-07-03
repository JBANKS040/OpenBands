use poseidon::poseidon::bn254::{hash_1, hash_2};

fn polynomial_input() -> Field {
    hash_2([69, 420])
}