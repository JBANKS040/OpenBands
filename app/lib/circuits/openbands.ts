import { generateInputs } from "noir-jwt";
import { InputMap, type CompiledCircuit } from "@noir-lang/noir_js";
import { initProver, initVerifier } from "../lazy-modules";
import { splitBigIntToLimbs } from "../utils";
import { MAX_HEADER_LENGTH, MAX_BODY_LENGTH } from "../zkemail/zkEmailTestValueGenerator.tsx";

const MAX_DOMAIN_LENGTH = 64;
const MAX_POSITION_LENGTH = 128;
const MAX_SALARY_LENGTH = 32;

export const OPENBANDS_CIRCUIT_HELPER = {
  generateProof: async ({
    idToken,
    jwtPubkey,
    domain,
    position,
    salary,
    ratings,
    // @dev - Input parameters for email verification /w ZKEmail.nr
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
    header: string;
    //header: BoundedVec; // Entire Email Header (NOTE: Should be the same data type with the "position" and "salary" parameter) 
    body: string;
    //body: BoundedVec;   // Entire Email Body   (NOTE: Should be the same data type with the "position" and "salary" parameter) 
    pubkey: {
      modulus: string[];
      redc: string[];
    };
    signature: string[];
    body_hash_index: number;
    dkim_header_sequence: {
      index: number;
      length: number;
    };
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

    // @dev - Input parameters for email verification /w ZKEmail.nr
    const headerUint8Array = new Uint8Array(MAX_HEADER_LENGTH);
    headerUint8Array.set(Uint8Array.from(new TextEncoder().encode(header)));
    console.log(`headerUint8Array: ${headerUint8Array}`);

    const bodyUint8Array = new Uint8Array(MAX_BODY_LENGTH);
    bodyUint8Array.set(Uint8Array.from(new TextEncoder().encode(body)));
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
      // @dev - Input parameters for email verification /w ZKEmail.nr
      header: {
        //storage: [74,111,98,32,79,102,102,101,114,32,102,114,111,109,32,65,120,66,120,67,32,67,111,114,112],
        storage: Array.from(headerUint8Array),
        //len: 512,
        len: header.length,
      },
      body: {
        //storage: [68,101,97,114,32,65,108,105,99,101,44,13,10,87,101,32,97,114,101,32,112,108,101,97,115,101,100,32,116,111,32,111,102,102,105,99,105,97,108,108,121,32,99,111,110,102,105,114,109,32,121,111,117,114,32,101,109,112,108,111,121,109,101,110,116,32,119,105,116,104,32,65,120,66,120,67,32,67,111,114,112,46,32,89,111,117,32,119,105,108,108,32,98,101,32,106,111,105,110,105,110,103,32,117,115,32,97,115,32,97,32,83,101,110,105,111,114,32,83,111,102,116,119,97,114,101,32,69,110,103,105,110,101,101,114,44,32,114,101,112,111,114,116,105,110,103,32,116,111,32,66,111,98,32,68,97,118,105,100,44,32,115,116,97,114,116,105,110,103,32,111,110,32,74,117,110,101,32,49,46,13,10,89,111,117,114,32,115,116,97,114,116,105,110,103,32,97,110,110,117,97,108,32,115,97,108,97,114,121,32,119,105,108,108,32,98,101,32,36,49,48,48,44,48,48,48,44,32,112,97,121,97,98,108,101,32,111,110,32,97,32,97,110,110,117,97,108,108,121,32,98,97,115,105,115,44,32,115,117,98,106,101,99,116,32,116,111,32,115,116,97,110,100,97,114,100,32,100,101,100,117,99,116,105,111,110,115,32,97,110,100,32,119,105,116,104,104,111,108,100,105,110,103,115,46,32,89,111,117,32,119,105,108,108,32,97,108,115,111,32,98,101,32,101,108,105,103,105,98,108,101,32,102,111,114,32,104,101,97,108,116,104,32,105,110,115,117,114,97,110,99,101,44,32,97,115,32,111,117,116,108,105,110,101,100,32,105,110,32,116,104,101,32,101,109,112,108,111,121,101,101,32,104,97,110,100,98,111,111,107,46,13,10,87,101,226,128,153,114,101,32,101,120,99,105,116,101,100,32,116,111,32,104,97,118,101,32,121,111,117,32,111,110,32,98,111,97,114,100,32,97,110,100,32,108,111,111,107,32,102,111,114,119,97,114,100,32,116,111,32,115,101,101,105,110,103,32,121,111,117,32,103,114,111,119,32,119,105,116,104,32,117,115,46,32,80,108,101,97,115,101,32,102,101,101,108,32,102,114,101,101,32,116,111,32,114,101,97,99,104,32,111,117,116,32,105,102,32,121,111,117,32,104,97,118,101,32,97,110,121,32,113,117,101,115,116,105,111,110,115,32,98,101,102,111,114,101,32,121,111,117,114,32,115,116,97,114,116,32,100,97,116,101,46,13,10,87,101,108,99,111,109,101,32,116,111,32,116,104,101,32,116,101,97,109,33,13,10,87,97,114,109,32,114,101,103,97,114,100,115,44,13,10,65,108,105,99,101,32,69,108,105,115,97,98,101,116,104,13,10,83,101,110,105,111,114,32,83,111,102,116,119,97,114,101,32,69,110,103,105,110,101,101,114,13,10,65,120,66,120,67,32,67,111,114,112,13,10,99,111,110,116,97,99,116,64,97,120,98,120,99,46,99,111,109],
        storage: Array.from(bodyUint8Array),
        //len: 1024,
        len: body.length,
      },
      pubkey,
      // pubkey: {
      //   modulus: [
      //     "0xe5cf995b5ef59ce9943d1f4209b6ab",
      //     "0xe0caf03235e91a2db27e9ed214bcc6",
      //     "0xafe1309f87414bd36ed296dacfade2",
      //     "0xbeff3f19046a43adce46c932514988",
      //     "0x324041af8736e87de4358860fff057",
      //     "0xadcc6669dfa346f322717851a8c22a",
      //     "0x8b2a193089e6bf951c553b5a6f71aa",
      //     "0x0a570fe582918c4f731a0002068df2",
      //     "0x39419a433d6bfdd1978356cbca4b60",
      //     "0x550d695a514d38b45c862320a00ea5",
      //     "0x1c56ac1dfbf1beea31e8a613c2a51f",
      //     "0x6a30c9f22d2e5cb6934263d0838809",
      //     "0x0a281f268a44b21a4f77a91a52f960",
      //     "0x5134dc3966c8e91402669a47cc8597",
      //     "0x71590781df114ec072e641cdc5d224",
      //     "0xa1bc0f0937489c806c1944fd029dc9",
      //     "0x911f6e47f84db3b64c3648ebb5a127",
      //     "0xd5",
      //   ],
      //   redc: [
      //     "0x48a824e4ebc7e0f1059f3ecfa57c46",
      //     "0x5c1db23f3c7d47ad7e7d7cfda5189a",
      //     "0x9bb6bbbd8facf011f022fa9051aec0",
      //     "0x4faa4cef474bed639362ea71f7a217",
      //     "0x503aa50b77e24b030841a7d0615812",
      //     "0xbbf4e62805e1860a904c0f66a5fad1",
      //     "0xcbd24b72442d2ce647dd7d0a443685",
      //     "0x74a8839a4460c169dce7138efdaef5",
      //     "0xf06e09e3191b995b08e5b45182f650",
      //     "0x1fad4a89f8369fe10e5d4b6e149a10",
      //     "0xc778b15982d11ebf7fe23b4e15f105",
      //     "0x09ff3a4567077510c474e4ac0a21ad",
      //     "0x37e69e5dbb77167b73065e4c5ad6aa",
      //     "0xcf4774e22e7fe3a38642186f7ae74b",
      //     "0x6e72b5eb4c813a3b37998083aab81e",
      //     "0x48e7050aa8abedce5a45c169853761",
      //     "0xd3285e53b322b221f7bcf4f8f8ad8a",
      //     "0x132d",
      //   ],
      // },
      signature,
      // signature: [
      //   "0xf193c3300b7c9902e32861c38d0d2d",
      //   "0x9f6927fdb3df0b84092d8459654327",
      //   "0x8a0bea5e2fa82821e49c27b68d5a7b",
      //   "0xaa8c0acc1190f9fd845ef64f8e7ae9",
      //   "0xa7aeebb37f4395965543e6df69a5a7",
      //   "0x087ecef9921569cfba83331ca11c6b",
      //   "0x4589ed316ed20757e65ad221736011",
      //   "0x0835d8748f11dcc985700c3fea27b1",
      //   "0xe870d2493fb83b4a1d72350e5de926",
      //   "0x268b28eda0aac07625cfab32b60af1",
      //   "0xb41a164eae7ba1602eaec5b5a39fe6",
      //   "0x693cc5ec578422bee48eabe390fc37",
      //   "0xa29504dd504f14423f2ce65b2ac388",
      //   "0x6c3ac6310c084a0b126fcd5225c208",
      //   "0xab0903e48563e5f4a5365ac5cbd888",
      //   "0xf05bf2e5b6266c0ac88dfc733c414f",
      //   "0xf58f9e9669e0f4f3086cce1187fd44",
      //   "0xb9",
      // ],
      body_hash_index,
      dkim_header_sequence
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