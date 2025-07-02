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

    // struct Poseidon2HashAndPublicInputs {
    //     string hash; // Poseidon Hash of "nullifier"
    //     bytes32 nullifier;
    // }

    function setUp() public {}

    function run() public returns (bool) {
        verifier = new HonkVerifier();
        positionAndSalaryProof2048Verifier = new PositionAndSalaryProof2048Verifier(verifier);

        // @dev - Retrieve the Poseidon2 hash and public inputs, which was read from the output.json file
        // Poseidon2HashAndPublicInputs memory poseidon2HashAndPublicInputs = computePoseidon2Hash();
        // bytes32 nullifierHash = poseidon2HashAndPublicInputs.nullifier;
        // console.logBytes32(nullifierHash);       // [Log]: 0x26df0d347e961cb94e1cc6d2ad8558696de8c1964b30e26f2ec8b926cbbbf862

        // @dev - [TODO]: Read a proof file from a JSON file.
        bytes memory proof_w_inputs = vm.readFileBinary("./circuits/circuit-for-zkemail-2048-bit-dkim/target/openbands_proof.bin");
        bytes memory proofBytes = ProofConverter.sliceAfter96Bytes(proof_w_inputs);    /// @dev - In case of that there are 3 public inputs (bytes32 * 3 = 96 bytes), the proof file includes 96 bytes of the public inputs at the beginning. Hence it should be removed by using this function.
        //bytes memory proofBytes = ProofConverter.sliceAfter64Bytes(proof_w_inputs);  /// @dev - In case of that there are 2 public inputs (bytes32 * 2 = 64 bytes), the proof file includes 64 bytes of the public inputs at the beginning. Hence it should be removed by using this function.

        bytes32[] memory correctPublicInputs = new bytes32[](1);
        correctPublicInputs[0] = nullifierHash;
    
        bool isValidProof = positionAndSalaryProof2048Verifier.verifyPositionAndSalaryProof(proofBytes, correctPublicInputs);
        require(isValidProof == true, "isValidProof should be true");
        console.logBool(isValidProof); // [Log]: true
        return isValidProof;
    }

    /**
     * @dev - Compute Poseidon2 hash
     */
    // function computePoseidon2Hash() public returns (Poseidon2HashAndPublicInputs memory _poseidon2HashAndPublicInputs) {
    //     /// @dev - Run the Poseidon2 hash generator script
    //     string[] memory ffi_commands_for_generating_poseidon2_hash = new string[](2);
    //     ffi_commands_for_generating_poseidon2_hash[0] = "sh";
    //     ffi_commands_for_generating_poseidon2_hash[1] = "script/utils/poseidon2-hash-generator/usages/async/runningScript_poseidon2HashGeneratorWithAsync.sh";
    //     bytes memory commandResponse = vm.ffi(ffi_commands_for_generating_poseidon2_hash);
    //     console.log(string(commandResponse));

    //     /// @dev - Write the output.json of the Poseidon2 hash-generated and Read the 'hash' field from the output.json
    //     string[] memory ffi_commands_for_generating_output_json = new string[](3);
    //     ffi_commands_for_generating_output_json[0] = "sh";
    //     ffi_commands_for_generating_output_json[1] = "-c";
    //     ffi_commands_for_generating_output_json[2] = "cat script/utils/poseidon2-hash-generator/usages/async/output/output.json | grep 'hash' | awk -F '\"' '{print $4}'"; // Extracts the 'hash' field

    //     bytes memory poseidon2HashBytes = vm.ffi(ffi_commands_for_generating_output_json);
    //     //console.logBytes(poseidon2HashBytes);

    //     /// @dev - Read the output.json file and parse the JSON data
    //     string memory json = vm.readFile("script/utils/poseidon2-hash-generator/usages/async/output/output.json");
    //     console.log(json);
    //     bytes memory data = vm.parseJson(json);
    //     //console.logBytes(data);

    //     string memory _hash = vm.parseJsonString(json, ".hash");
    //     bytes32 _merkleRoot = vm.parseJsonBytes32(json, ".merkleRoot");
    //     bytes32 _nullifier = vm.parseJsonBytes32(json, ".nullifier");
    //     bytes32 _nftMetadataCidHash = vm.parseJsonBytes32(json, ".nftMetadataCidHash");
    //     console.logString(_hash);
    //     console.logBytes32(_merkleRoot);
    //     console.logBytes32(_nullifier);
    //     console.logBytes32(_nftMetadataCidHash);

    //     Poseidon2HashAndPublicInputs memory poseidon2HashAndPublicInputs = Poseidon2HashAndPublicInputs({
    //         hash: _hash,
    //         merkleRoot: _merkleRoot,
    //         nullifier: _nullifier,
    //         nftMetadataCidHash: _nftMetadataCidHash
    //     });
    //     // console.logString(poseidon2HashAndPublicInputs.hash);
    //     // console.logBytes32(poseidon2HashAndPublicInputs.merkleRoot);
    //     // console.logBytes32(poseidon2HashAndPublicInputs.nullifier);
    //     // console.logBytes32(poseidon2HashAndPublicInputs.nftMetadataCidHash);

    //     return poseidon2HashAndPublicInputs;
    // }

}