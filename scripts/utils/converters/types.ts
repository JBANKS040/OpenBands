import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { CompiledCircuit, ProofData } from '@noir-lang/types';

export type Circuits = CompiledCircuit;

export type BackendInstances = BarretenbergBackend;

export type Noirs = Noir;

export interface ProofArtifacts extends ProofData {
  proofAsFields: string;
  vkAsFields: string;
  vkHash: string;
}
