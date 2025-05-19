import { generateInputs } from "noir-jwt";
import { InputMap, type CompiledCircuit } from "@noir-lang/noir_js";
import { initProver, initVerifier } from "../lazy-modules";
import { splitBigIntToLimbs } from "../utils";
import { MAX_HEADER_LENGTH, MAX_BODY_LENGTH } from '../zkemail/server-side-libraries/zkEmailVerifierInputsGenerator';
//import { MAX_HEADER_LENGTH, MAX_BODY_LENGTH } from "../zkemail/zkEmailTestValueGenerator.tsx";

const MAX_DOMAIN_LENGTH = 64;
const MAX_POSITION_LENGTH = 128;
const MAX_SALARY_LENGTH = 32;
//const MAX_HEADER_LENGTH = 512;
//const MAX_BODY_LENGTH = 1024;

export const OPENBANDS_CIRCUIT_HELPER = {
  generateProof: async ({
    idToken,
    jwtPubkey,
    domain,
    position,
    salary,
    ratings,
    /// @dev - zkEmail related input arguments
    header,
    body,
    pubkey,
    signature,
    body_hash_index,
    dkim_header_sequence,
  }: {
    idToken: string;
    jwtPubkey: JsonWebKey;
    domain: string;
    position: string;
    salary: string;
    ratings: {
      work_life_balance: number;
      culture_values: number;
      career_growth: number;
      compensation_benefits: number;
      leadership_quality: number;
      operational_efficiency: number;
    };
    // @dev - Input parameters for email verification /w ZKEmail.nr
    // header: {
    //   storage: Uint8Array;
    //   len: number;
    // },
    // body: {
    //   storage: Uint8Array;
    //   len: number;
    // },
    // pubkey: {
    //   modulus: string[];
    //   redc: string[];
    // };
    // signature: string[];
    // body_hash_index: number;
    // dkim_header_sequence: {
    //   index: number;
    //   length: number;
    // };
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

    // @dev - Input data for an Email verification /w ZKEmail.nr
    const headerUint8Array = new Uint8Array(MAX_HEADER_LENGTH);
    headerUint8Array.set(header.storage as Uint8Array);
    //headerUint8Array.set(Uint8Array.from(new TextEncoder().encode(header)));
    console.log(`headerUint8Array: ${headerUint8Array}`);

    const bodyUint8Array = new Uint8Array(MAX_BODY_LENGTH);
    bodyUint8Array.set(body.storage as Uint8Array);
    //bodyUint8Array.set(Uint8Array.from(new TextEncoder().encode(body)));
    console.log(`bodyUint8Array: ${bodyUint8Array}`);

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
      work_life_balance: ratings.work_life_balance,
      culture_values: ratings.culture_values,
      career_growth: ratings.career_growth,
      compensation_benefits: ratings.compensation_benefits,
      leadership_quality: ratings.leadership_quality,
      operational_efficiency: ratings.operational_efficiency,

      // @dev - Input data for an Email verification /w ZKEmail.nr
      header: {
        storage: Array.from(headerUint8Array),
        len: headerUint8Array.length,
      },
      // header: {
      //   storage: Array.from(header.storage),
      //   len: header.len,
      // },
      body: {
        storage: Array.from(bodyUint8Array),
        len: bodyUint8Array.length,
      },
      // body: {
      //   storage: Array.from(body.storage),
      //   len: body.len,
      // },
      pubkey,
      signature,
      body_hash_index,
      dkim_header_sequence
      // pubkey: pubkeyLimbs2048,
      // signature: signatureLimbs2048,
      // body_hash_index: bodyHashIndex,
      // dkim_header_sequence: dkimHeaderSequence
    };

    console.log("ZKLevels circuit inputs", inputs);

    const { Noir, UltraHonkBackend } = await initProver();
    const circuitArtifact = await import(`../../assets/openbands-0.0.1/openbands.json`);
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
      ratings,
    }: {
      domain: string;
      position: string;
      salary: string;
      jwtPubKey: bigint;
      ratings: {
        work_life_balance: number;
        culture_values: number;
        career_growth: number;
        compensation_benefits: number;
        leadership_quality: number;
        operational_efficiency: number;
      };
    }
  ) => {
    try {
      if (!domain || !position || !salary || !jwtPubKey || !ratings) {
        throw new Error(
          "[JWT Circuit] Proof verification failed: invalid public inputs"
        );
      }

      console.log("Verifying proof with inputs:", {
        domain,
        position,
        salary,
        ratings: {
          work_life_balance: ratings.work_life_balance,
          culture_values: ratings.culture_values,
          career_growth: ratings.career_growth,
          compensation_benefits: ratings.compensation_benefits,
          leadership_quality: ratings.leadership_quality,
          operational_efficiency: ratings.operational_efficiency
        }
      });

      const { UltraHonkBackend } = await initVerifier();

      try {
        const vkey = await import(`../../assets/openbands-0.0.1/vk.json`);
        console.log("Loaded verification key");
      } catch (err) {
        console.error("Failed to load verification key:", err);
        throw new Error("Failed to load verification key");
      }

      // Public Inputs = pubkey_limbs(18) + domain(64) + position(128) + salary(32) + ratings(6) = 248
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

      console.log("Adding ratings to public inputs:", {
        work_life_balance: ratings.work_life_balance,
        culture_values: ratings.culture_values,
        career_growth: ratings.career_growth,
        compensation_benefits: ratings.compensation_benefits,
        leadership_quality: ratings.leadership_quality,
        operational_efficiency: ratings.operational_efficiency
      });

      // Push ratings as public inputs
      publicInputs.push("0x" + ratings.work_life_balance.toString(16).padStart(64, "0"));
      publicInputs.push("0x" + ratings.culture_values.toString(16).padStart(64, "0"));
      publicInputs.push("0x" + ratings.career_growth.toString(16).padStart(64, "0"));
      publicInputs.push("0x" + ratings.compensation_benefits.toString(16).padStart(64, "0"));
      publicInputs.push("0x" + ratings.leadership_quality.toString(16).padStart(64, "0"));
      publicInputs.push("0x" + ratings.operational_efficiency.toString(16).padStart(64, "0"));

      const proofData = {
        proof: proof,
        publicInputs,
      };

      try {
        const circuitArtifact = await import(`../../assets/openbands-0.0.1/openbands.json`);
        console.log("Loaded circuit artifact");
        
        const backend = new UltraHonkBackend(circuitArtifact.bytecode, { threads: 8 });
        console.log("Initialized UltraHonkBackend");
        
        const result = await backend.verifyProof(proofData);
        console.log("Proof verification result:", result);
        
        return result;
      } catch (err) {
        console.error("Failed during proof verification:", err);
        throw err;
      }
    } catch (err) {
      console.error("Error in verifyProof:", err);
      throw err;
    }
  },
}; 