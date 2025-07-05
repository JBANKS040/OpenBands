use poseidon::poseidon::bn254::{hash_1, hash_2};

global NUM_HEADERS: u32 = 10;

pub fn polynomial_input() -> Field {
    hash_2([69, 420])
}

// TODO: can we use generics for input?
pub fn polynomial_digest<let N: u32>(
    input: [Field; N],
    digest_ratio: Field,
    default_multiplier: Field,
) -> Field {
    let mut digest = Field::default();

    let mut multiplier = default_multiplier;
    for item in input {
        digest += multiplier * item; // TODO: check if subtyping is expensive
        multiplier *= digest_ratio;
    }

    digest
}