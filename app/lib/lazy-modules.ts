import { Barretenberg, UltraHonkBackend } from "@aztec/bb.js";
import { Noir, CompiledCircuit } from "@noir-lang/noir_js";

let proverInitialized = false;
let verifierInitialized = false;
let barretenberg: Barretenberg | null = null;

export async function initProver() {
  if (proverInitialized) {
    return {
      Noir,
      UltraHonkBackend,
    };
  }

  // Initialize Barretenberg
  barretenberg = await Barretenberg.new();

  proverInitialized = true;

  return {
    Noir,
    UltraHonkBackend,
  };
}

export async function initVerifier() {
  if (verifierInitialized) {
    return {
      UltraHonkBackend,
    };
  }

  verifierInitialized = true;

  return {
    UltraHonkBackend,
  };
} 