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
    //mapping(bytes32 nullifierHash => bytes32[] publicInputs) public publicInputsOfPositionAndSalaryProofs;  // nullifierHash -> publicInputs[]
    
    mapping(bytes32 nullifierHash => bool isNullified) public nullifiers;

    DataType.PublicInput[] public publicInputsOfAllProofs;  // The publicInputs of all PositionAndSalaryProofs to show the list of all proofs related data on FE (front-end).
    //bytes32[][] public publicInputsOfAllProofs;  // The publicInputs of all PositionAndSalaryProofs to show the list of all proofs related data on FE (front-end).

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
        bytes32 nullifierHash,
        uint16 rsaSignatureLength, // 9 or 18

        // @dev - [TODO]: Add the each values (elements) of a given "publicInputs" array argument to below:
        //                 --> Store the arguments, which is specified in the "const generatedProof = await OPENBANDS_CIRCUIT_HELPER.generateProof()".
        bytes calldata jwtPubkeyModulusLimbs,
        bytes calldata domain,
        bytes calldata position,
        bytes calldata salary,
        bytes calldata workLifeBalance,
        bytes calldata cultureValues, 
        bytes calldata careerGrowth, 
        bytes calldata compensationBenefits, 
        bytes calldata leadershipQuality, 
        bytes calldata operationalEfficiency
        // string calldata jwtPubkeyModulusLimbs,
        // string calldata domain,
        // string calldata position,
        // string calldata salary,
        // uint8 workLifeBalance,
        // uint8 cultureValues, 
        // uint8 careerGrowth, 
        // uint8 compensationBenefits, 
        // uint8 leadershipQuality, 
        // uint8 operationalEfficiency
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

        // @dev - Decode the given arguments of respective publicInputs
        (string memory _jwtPubkeyModulusLimbs) = abi.decode(jwtPubkeyModulusLimbs, (string));
        (string memory _domain) = abi.decode(domain, (string));
        (string memory _position) = abi.decode(position, (string));
        (string memory _salary) = abi.decode(salary, (string));
        (uint8 _workLifeBalance) = abi.decode(workLifeBalance, (uint8));
        (uint8 _cultureValues) = abi.decode(cultureValues, (uint8));
        (uint8 _careerGrowth) = abi.decode(careerGrowth, (uint8));
        (uint8 _compensationBenefits) = abi.decode(compensationBenefits, (uint8));
        (uint8 _leadershipQuality) = abi.decode(leadershipQuality, (uint8));
        (uint8 _operationalEfficiency) = abi.decode(operationalEfficiency, (uint8));

        // @dev - Record a publicInput of a given PositionAndSalaryProof
        DataType.PublicInput memory publicInput;
        publicInput.jwtPubkeyModulusLimbs = _jwtPubkeyModulusLimbs;
        publicInput.domain = _domain;
        publicInput.position = _position;
        publicInput.salary = _salary;
        publicInput.workLifeBalance = _workLifeBalance;
        publicInput.cultureValues = _cultureValues;
        publicInput.careerGrowth = _careerGrowth;
        publicInput.compensationBenefits = _compensationBenefits;
        publicInput.leadershipQuality = _leadershipQuality;
        publicInput.operationalEfficiency = _operationalEfficiency;
        publicInput.nullifierHash = nullifierHash;
        // DataType.PublicInput memory publicInput;
        // publicInput.jwtPubkeyModulusLimbs = publicInputs[0];
        // publicInput.domain = publicInputs[1];
        // publicInput.position = publicInputs[2];
        // publicInput.salary = publicInputs[3];
        // publicInput.workLifeBalance = publicInputs[4];
        // publicInput.cultureValues = publicInputs[5];
        // publicInput.careerGrowth = publicInputs[6];
        // publicInput.compensationBenefits = publicInputs[7];
        // publicInput.leadershipQuality = publicInputs[8];
        // publicInput.operationalEfficiency = publicInputs[9];
        // publicInput.nullifierHash = publicInputs[10];

        // @dev - Store the publicInput of a given PositionAndSalaryProof
        publicInputsOfPositionAndSalaryProofs[publicInput.nullifierHash] = publicInput; // @dev - The original
        //publicInputsOfPositionAndSalaryProofs[nullifierHash] = publicInputs;

        // @dev - Store the nullifierHash to prevent double submission of the same email
        nullifiers[publicInput.nullifierHash] = true; // @dev - The original
        //nullifiers[nullifierHash] = true;

        // @dev - Store the publicInputs into the list of all proofs to be displayed on the UI (front-end).
        publicInputsOfAllProofs.push(publicInput);  // @dev - The original
        //publicInputsOfAllProofs.push(publicInputs);
    }

    /**
     * @notice - Retrieve the publicInputs of a given proof from on-chain.
     * @dev - When a proof is stored with publicInput into the this smart contract via the recordPositionAndSalaryProof(), the given proof is verfied by the validation. 
     *        Hence, the publicInput is guaranteed to be valid and a proof does not need to be specified in this function.
     */
    //function getPublicInputsOfPositionAndSalaryProof(bytes32 nullifierHash) public view returns (bytes32[] memory _publicInput) {
    function getPublicInputsOfPositionAndSalaryProof(bytes32 nullifierHash) public view returns (DataType.PublicInput memory _publicInput) {
        require(nullifiers[nullifierHash] == true, "A given nullifierHash is invalid"); // Double spending (of proof) prevention
        return publicInputsOfPositionAndSalaryProofs[nullifierHash];
    }

    /**
     * @notice - Retrieve the publicInputs of all proofs from on-chain to be displayed on the UI (front-end).
     */
    //function getPublicInputsOfAllProofs() public view returns (bytes32[] memory _publicInputsOfAllProofs) {
    function getPublicInputsOfAllProofs() public view returns (DataType.PublicInput[] memory) {
        return publicInputsOfAllProofs;
    }
}