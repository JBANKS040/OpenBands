pragma solidity >=0.8.21;

import { PositionAndSalaryProof2048Verifier } from "./PositionAndSalaryProof2048Verifier.sol";
import { DataType } from "../../dataType/DataType.sol";

/**
 * @notice - This contract is used to manage the position and salary proof (2048-bit DKIM signature) with its publicInputs.
 */
contract PositionAndSalaryProof2048Manager {
    using DataType for DataType.PublicInput;

    PositionAndSalaryProof2048Verifier public positionAndSalaryProof2048Verifier;

    mapping(bytes32 nullifierHash => DataType.PublicInput) public publicInputsOfPositionAndSalaryProofs;  // nullifierHash -> PublicInput
    mapping(bytes32 nullifierHash => bool isNullified) public nullifiers;

    constructor(PositionAndSalaryProof2048Verifier _positionAndSalaryProof2048Verifier) {
        positionAndSalaryProof2048Verifier = _positionAndSalaryProof2048Verifier;
    }

    /**
     * @notice - Record the publicInputs of a given proof (2048-bit DKIM signature) on-chain.
     */
    function recordPublicInputsOfPositionAndSalaryProof(bytes calldata proof, bytes32[] calldata publicInputs) public returns (bool) {
        // Verify a PositionAndSalaryProof
        bool result = positionAndSalaryProof2048Verifier.verifyPositionAndSalaryProof(proof, publicInputs);
        require(result, "A given position and salary proof is not valid is not valid");

        // Record a publicInput of a given PositionAndSalaryProof
        DataType.PublicInput memory publicInput;
        publicInput.jwtPubkeyModulusLimbs = publicInputs[0];
        publicInput.domain = publicInputs[1];
        publicInput.position = publicInputs[2];
        publicInput.salary = publicInputs[3];
        publicInput.workLifeBalance = publicInputs[4];
        publicInput.cultureValues = publicInputs[5];
        publicInput.careerGrowth = publicInputs[6];
        publicInput.compensationBenefits = publicInputs[7];
        publicInput.leadershipQuality = publicInputs[8];
        publicInput.operationalEfficiency = publicInputs[9];
        publicInput.nullifierHash = publicInputs[10];

        // Store the publicInput of a given PositionAndSalaryProof
        publicInputsOfPositionAndSalaryProofs[publicInput.nullifierHash] = publicInput;

        // Store the nullifierHash to prevent double submission of the same email
        nullifiers[publicInput.nullifierHash] = true;
    }

    /**
     * @notice - Retrieve the publicInputs of a given proof from on-chain.
     * @dev - When a proof is stored with publicInput into the this smart contract via the recordPositionAndSalaryProof(), the given proof is verfied by the validation. 
     *        Hence, the publicInput is guaranteed to be valid and a proof does not need to be specified in this function.
     */
    function getPublicInputsOfPositionAndSalaryProof(bytes32 nullifierHash) public view returns (DataType.PublicInput memory _publicInput) {
        require(nullifiers[nullifierHash] == true, "A given nullifierHash is invalid"); // Double spending (of proof) prevention
        return publicInputsOfPositionAndSalaryProofs[nullifierHash];
    }
}