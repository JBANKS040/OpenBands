import { generateInputs } from "noir-jwt";
import { InputMap, type CompiledCircuit } from "@noir-lang/noir_js";
import { initProver, initVerifier } from "../lazy-modules";
import { splitBigIntToLimbs } from "../utils";

const MAX_DOMAIN_LENGTH = 64;
const MAX_POSITION_LENGTH = 128;
const MAX_SALARY_LENGTH = 32;

export const ZKLEVELS_CIRCUIT_HELPER = {
  generateProof: async ({
    idToken,
    jwtPubkey,
    domain,
    position,
    salary,
  }: {
    idToken: string;
    jwtPubkey: JsonWebKey;
    domain: string;
    position: string;
    salary: string;
  }) => {
    if (!idToken || !jwtPubkey) {
      throw new Error(
        "[JWT Circuit] Proof generation failed: idToken and jwtPubkey are required"
      );
    }

    const jwtInputs = await generateInputs({
      jwt: idToken,
      pubkey: jwtPubkey,
      shaPrecomputeTillKeys: ["email", "email_verified"],
      maxSignedDataLength: 640,
    });

    const domainUint8Array = new Uint8Array(MAX_DOMAIN_LENGTH);
    domainUint8Array.set(Uint8Array.from(new TextEncoder().encode(domain)));

    const positionUint8Array = new Uint8Array(MAX_POSITION_LENGTH);
    positionUint8Array.set(Uint8Array.from(new TextEncoder().encode(position)));

    const salaryUint8Array = new Uint8Array(MAX_SALARY_LENGTH);
    salaryUint8Array.set(Uint8Array.from(new TextEncoder().encode(salary)));

    const inputs = {
      partial_data: jwtInputs.partial_data,
      partial_hash: jwtInputs.partial_hash,
      full_data_length: jwtInputs.full_data_length,
      base64_decode_offset: jwtInputs.base64_decode_offset,
      jwt_pubkey_modulus_limbs: jwtInputs.pubkey_modulus_limbs,
      jwt_pubkey_redc_params_limbs: jwtInputs.redc_params_limbs,
      jwt_signature_limbs: jwtInputs.signature_limbs,
      domain: {
        storage: Array.from(domainUint8Array),
        len: domain.length,
      },
      position: {
        storage: Array.from(positionUint8Array),
        len: position.length,
      },
      salary: {
        storage: Array.from(salaryUint8Array),
        len: salary.length,
      },
    };

    console.log("ZKLevels circuit inputs", inputs);

    const { Noir, UltraHonkBackend } = await initProver();
    const circuitArtifact = await import(`../../assets/levels-0.0.1/circuit.json`);
    const backend = new UltraHonkBackend(circuitArtifact.bytecode, { threads: 8 });
    const noir = new Noir(circuitArtifact as CompiledCircuit);

    // Generate witness and prove
    const startTime = performance.now();
    const { witness } = await noir.execute(inputs as InputMap);
    const proof = await backend.generateProof(witness);
    const provingTime = performance.now() - startTime;

    console.log(`Proof generated in ${provingTime}ms`);

    return proof;
  },

  verifyProof: async (
    proof: Uint8Array,
    { domain,
      position,
      salary,
      jwtPubKey,
    }: {
      domain: string;
      position: string;
      salary: string;
      jwtPubKey: bigint;
    }
  ) => {
    if (!domain || !position || !salary || !jwtPubKey) {
      throw new Error(
        "[JWT Circuit] Proof verification failed: invalid public inputs"
      );
    }

    const { UltraHonkBackend } = await initVerifier();

    const vkey = await import(`../../assets/levels-0.0.1/circuit-vkey.json`);

    // Public Inputs = pubkey_limbs(18) + domain(64) + position(128) + salary(32) = 242
    const publicInputs: string[] = [];

    // Push modulus limbs as 64 char hex strings (18 Fields)
    const modulusLimbs = splitBigIntToLimbs(jwtPubKey, 120, 18);
    publicInputs.push(
      ...modulusLimbs.map((s) => "0x" + s.toString(16).padStart(64, "0"))
    );

    // Push domain + domain length (BoundedVec of 64 bytes)
    const domainUint8Array = new Uint8Array(64);
    domainUint8Array.set(Uint8Array.from(new TextEncoder().encode(domain)));
    publicInputs.push(
      ...Array.from(domainUint8Array).map(
        (s) => "0x" + s.toString(16).padStart(64, "0")
      )
    );
    publicInputs.push("0x" + domain.length.toString(16).padStart(64, "0"));

    // Push position + position length (BoundedVec of 128 bytes)
    const positionUint8Array = new Uint8Array(128);
    positionUint8Array.set(Uint8Array.from(new TextEncoder().encode(position)));
    publicInputs.push(
      ...Array.from(positionUint8Array).map(
        (s) => "0x" + s.toString(16).padStart(64, "0")
      )
    );
    publicInputs.push("0x" + position.length.toString(16).padStart(64, "0"));

    // Push salary + salary length (BoundedVec of 32 bytes)
    const salaryUint8Array = new Uint8Array(32);
    salaryUint8Array.set(Uint8Array.from(new TextEncoder().encode(salary)));
    publicInputs.push(
      ...Array.from(salaryUint8Array).map(
        (s) => "0x" + s.toString(16).padStart(64, "0")
      )
    );
    publicInputs.push("0x" + salary.length.toString(16).padStart(64, "0"));

    const proofData = {
      proof: proof,
      publicInputs,
    };

    const circuitArtifact = await import(`../../assets/levels-0.0.1/circuit.json`);
    const backend = new UltraHonkBackend(circuitArtifact.bytecode, { threads: 8 });
    const result = await backend.verifyProof(proofData);

    return result;
  },
}; 