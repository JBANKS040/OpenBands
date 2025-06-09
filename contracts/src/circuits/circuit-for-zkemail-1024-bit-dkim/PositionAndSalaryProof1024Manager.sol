pragma solidity >=0.8.21;

import { PositionAndSalaryProof1024Verifier } from "./PositionAndSalaryProof1024Verifier.sol";
import { DataType } from "../../dataType/DataType.sol";

/**
 * @notice - This contract is used to manage the position and salary proof for a 1024-bit DKIM signature.
 */
contract PositionAndSalaryProof1024Manager {
    using DataType for DataType.PublicInput;

    PositionAndSalaryProof1024Verifier public positionAndSalaryProof1024Verifier;

    mapping(address => mapping(bytes => DataType.PublicInput)) public publicInputsOfPositionAndSalaryProofs;
    mapping(address => mapping(bytes => bool)) public positionAndSalaryProofRecords;
    mapping(bytes32 hash => bool isNullified) public nullifiers;

    constructor(PositionAndSalaryProof1024Verifier _positionAndSalaryProof1024Verifier) {
        positionAndSalaryProof1024Verifier = _positionAndSalaryProof1024Verifier;
    }

    /**
     * @notice - Record a PositionAndSalaryProof on-chain /w publicInput.
     */
    function recordPositionAndSalaryProof(bytes calldata proof, bytes32[] calldata publicInputs) public returns (bool) {
        // Verify a PositionAndSalaryProof
        bool result = positionAndSalaryProof1024Verifier.verifyPositionAndSalaryProof(proof, publicInputs);
        require(result, "Travel History Proof is not valid");

        // Record a PositionAndSalaryProof
        positionAndSalaryProofRecords[msg.sender][proof] = true;

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
        publicInputsOfPositionAndSalaryProofs[msg.sender][proof] = publicInput;

        // Store the nullifierHash to prevent double submission of the same email
        nullifiers[publicInput.nullifierHash] = true;
    }

}