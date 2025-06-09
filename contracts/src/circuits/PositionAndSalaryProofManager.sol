pragma solidity >=0.8.21;

import { PositionAndSalaryProof1024Verifier } from "./circuit-for-zkemail-1024-bit-dkim/PositionAndSalaryProof1024Verifier.sol";
import { PositionAndSalaryProof2048Verifier } from "./circuit-for-zkemail-2048-bit-dkim/PositionAndSalaryProof2048Verifier.sol";
import { DataType } from "../dataType/DataType.sol";

/**
 * @notice - This contract is used to manage the position and salary proof (1024-bit DKIM signature) with its publicInputs.
 */
contract PositionAndSalaryProofManager {
    using DataType for DataType.PublicInput;

    PositionAndSalaryProof1024Verifier public positionAndSalaryProof1024Verifier;
    PositionAndSalaryProof2048Verifier public positionAndSalaryProof2048Verifier;

    // @dev - Storages
    mapping(bytes32 nullifierHash => DataType.PublicInput) public publicInputsOfPositionAndSalaryProofs;  // nullifierHash -> PublicInput
    mapping(bytes32 nullifierHash => bool isNullified) public nullifiers;
    DataType.PublicInput[] public publicInputsOfAllProofs;  // The publicInputs of all PositionAndSalaryProofs to show the list of all proofs related data on FE (front-end).

    constructor(
        PositionAndSalaryProof1024Verifier _positionAndSalaryProof1024Verifier, 
        PositionAndSalaryProof2048Verifier _positionAndSalaryProof2048Verifier
    ) {
        positionAndSalaryProof1024Verifier = _positionAndSalaryProof1024Verifier;
        positionAndSalaryProof2048Verifier = _positionAndSalaryProof2048Verifier;
    }

    /**
     * @notice - Record the publicInputs of a given proof (1024-bit DKIM signature) on-chain.
     */
    function recordPublicInputsOfPositionAndSalaryProof(
        bytes calldata proof, 
        bytes32[] calldata publicInputs,
        uint16 rsaSignatureLength // 9 or 18
    ) public returns (bool) {
        // Verify a PositionAndSalaryProof
        if (rsaSignatureLength == 9) {
            bool result = positionAndSalaryProof1024Verifier.verifyPositionAndSalaryProof(proof, publicInputs);
            require(result, "A given position and salary proof (1024-bit RSA signature) is not valid");
        } else if (rsaSignatureLength == 18) {
            bool result = positionAndSalaryProof2048Verifier.verifyPositionAndSalaryProof(proof, publicInputs);
            require(result, "A given position and salary proof (2048-bit RSA signature) is not valid");
        } else {
            revert("Unsupported RSA signature length");
        }

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

        // Store the publicInputs into the list of all proofs to be displayed on the UI (front-end).
        publicInputsOfAllProofs.push(publicInput);
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

    /**
     * @notice - Retrieve the publicInputs of all proofs from on-chain to be displayed on the UI (front-end).
     */
    function getPublicInputsOfAllProofs() public view returns (DataType.PublicInput[] memory) {
        return publicInputsOfAllProofs;
    }
}