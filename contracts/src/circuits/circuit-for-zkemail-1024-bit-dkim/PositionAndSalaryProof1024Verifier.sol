pragma solidity >=0.8.21;

import { HonkVerifier } from "./honk-verifier/honk_vk_for_1024-bit-dkim.sol";

/**
 * @notice - This contract is used to verify the position and salary proof for a 1024-bit DKIM signature.
 */
contract PositionAndSalaryProof1024Verifier {
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
