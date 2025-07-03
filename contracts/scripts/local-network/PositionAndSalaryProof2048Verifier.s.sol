pragma solidity ^0.8.17;

import { Script } from "forge-std/Script.sol";
import "forge-std/console.sol";

import { PositionAndSalaryProof2048Verifier } from "../../src/circuits/circuit-for-zkemail-2048-bit-dkim/PositionAndSalaryProof2048Verifier.sol";
import { HonkVerifier } from "../../src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier/plonk_vk_for_2048-bit-dkim.sol";
//import { UltraVerifier } from "../../circuits/target/contract.sol";
import { ProofConverter } from "../utils/converters/ProofConverter.sol";


contract PositionAndSalaryProof2048VerifierScript is Script {
    PositionAndSalaryProof2048Verifier public positionAndSalaryProof2048Verifier;
    HonkVerifier public verifier;

    struct PublicInputsFromJsonFile {
        //string hash; // Poseidon Hash of "nullifier"
        //bytes proof;
        bytes32 nullifier;
    }

    function setUp() public {}

    function run() public returns (bool) {
        verifier = new HonkVerifier();
        positionAndSalaryProof2048Verifier = new PositionAndSalaryProof2048Verifier(verifier);

        // @dev - Retrieve the Poseidon2 hash and public inputs, which was read from the output.json file
        //PublicInputsFromJsonFile memory publicInputsFromJsonFile = readMockDataJsonfile();
        bytes32 nullifierHash = 0x02cee43215533a171f9fe5a40dfe127cfc40610325f88913b7ad21ceff590065;
        //bytes32 nullifierHash = publicInputsFromJsonFile.nullifier;
        console.logBytes32(nullifierHash);       // [Log]: 0x26df0d347e961cb94e1cc6d2ad8558696de8c1964b30e26f2ec8b926cbbbf862

        // @dev - [TODO]: Read a proof file from a JSON file.
        bytes memory proof_w_inputs = vm.readFileBinary("./scripts/mock-data/proof.bin");
        bytes memory proofBytes = proof_w_inputs;
        //bytes memory proofBytes = ProofConverter.sliceAfter96Bytes(proof_w_inputs);    /// @dev - In case of that there are 3 public inputs (bytes32 * 3 = 96 bytes), the proof file includes 96 bytes of the public inputs at the beginning. Hence it should be removed by using this function.
        //bytes memory proofBytes = ProofConverter.sliceAfter64Bytes(proof_w_inputs);  /// @dev - In case of that there are 2 public inputs (bytes32 * 2 = 64 bytes), the proof file includes 64 bytes of the public inputs at the beginning. Hence it should be removed by using this function.
        //bytes memory proofBytes = publicInputsFromJsonFile.proof;

        bytes32[] memory correctPublicInputs = new bytes32[](1);
        correctPublicInputs[0] = nullifierHash;
    
        bool isValidProof = positionAndSalaryProof2048Verifier.verifyPositionAndSalaryProof(proofBytes, correctPublicInputs);
        require(isValidProof == true, "isValidProof should be true");
        console.logBool(isValidProof); // [Log]: true
        return isValidProof;
    }

    /**
     * @dev - Read mock data from the generatedProof.json file and parse the JSON data.
     */
    function readMockDataJsonfile() public returns (PublicInputsFromJsonFile memory _publicInputsFromJsonFile) {
        /// @dev - Read the output.json file and parse the JSON data
        string memory json = vm.readFile("scripts/mock-data/generatedProof.json");
        console.log(json);
        bytes memory data = vm.parseJson(json);
        //console.logBytes(data);

        //string memory _hash = vm.parseJsonString(json, ".hash");
        //bytes memory _proof = vm.parseJsonBytes(json, ".proof");
        bytes32 _nullifier = vm.parseJsonBytes32(json, ".publicInputs");
        //console.logString(_hash);
        //console.logBytes(_proof);
        console.logBytes32(_nullifier);

        PublicInputsFromJsonFile memory publicInputsFromJsonFile = PublicInputsFromJsonFile({
            //hash: _hash,
            //proof: _proof,
            nullifier: _nullifier
        });
        // console.logString(poseidon2HashAndPublicInputs.hash);
        // console.logBytes32(poseidon2HashAndPublicInputs.nullifier);

        return publicInputsFromJsonFile;
    }

}