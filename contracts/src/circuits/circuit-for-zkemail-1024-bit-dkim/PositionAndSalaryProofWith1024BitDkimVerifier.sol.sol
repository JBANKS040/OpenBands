pragma solidity >=0.8.21;

import { HonkVerifier } from "./honk-verifier/plonk_vk_for_1024-bit-dkim.sol";

contract PositionAndSalaryProofVerifier {
    HonkVerifier public verifier;

    constructor(HonkVerifier _verifier) {
        verifier = _verifier;
    }

    function verifyPositionAndSalaryProof(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        bool proofResult = verifier.verify(proof, publicInputs);
        require(proofResult, "Proof is not valid");
        return proofResult;
    }
}
