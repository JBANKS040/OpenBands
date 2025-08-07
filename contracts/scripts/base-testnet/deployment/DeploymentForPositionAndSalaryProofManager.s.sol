pragma solidity >=0.8.21;

import "forge-std/Script.sol";

/// @dev - ZK circuit, which is generated in Noir.
import { PositionAndSalaryProof1024Verifier } from "../../../src/circuits/circuit-for-zkemail-1024-bit-dkim/PositionAndSalaryProof1024Verifier.sol";
import { PositionAndSalaryProof2048Verifier } from "../../../src/circuits/circuit-for-zkemail-2048-bit-dkim/PositionAndSalaryProof2048Verifier.sol";
import { PositionAndSalaryProofManager } from "../../../src/circuits/PositionAndSalaryProofManager.sol";

/**
 * @notice - Deployment script to deploy the PositionAndSalaryProof2048Verifier contract on BASE Testnet
 */
contract DeploymentForPositionAndSalaryProofManager is Script {
    PositionAndSalaryProof1024Verifier public positionAndSalaryProof1024Verifier;
    PositionAndSalaryProof2048Verifier public positionAndSalaryProof2048Verifier;
    PositionAndSalaryProofManager public positionAndSalaryProofManager;

    function setUp() public {}

    function run() public {
        vm.createSelectFork("base_testnet");
        uint256 deployerPrivateKey = vm.envUint("BASE_TESTNET_PRIVATE_KEY");
        //uint256 deployerPrivateKey = vm.envUint("LOCALHOST_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        //vm.startBroadcast();

        address POSITION_AND_SALARY_PROOF_1024_VERIFIER_ON_BASE_TESTNET = vm.envAddress("POSITION_AND_SALARY_PROOF_1024_VERIFIER_ON_BASE_TESTNET");
        address POSITION_AND_SALARY_PROOF_2048_VERIFIER_ON_BASE_TESTNET = vm.envAddress("POSITION_AND_SALARY_PROOF_2048_VERIFIER_ON_BASE_TESTNET");
        positionAndSalaryProof1024Verifier = PositionAndSalaryProof1024Verifier(POSITION_AND_SALARY_PROOF_1024_VERIFIER_ON_BASE_TESTNET);
        positionAndSalaryProof2048Verifier = PositionAndSalaryProof2048Verifier(POSITION_AND_SALARY_PROOF_2048_VERIFIER_ON_BASE_TESTNET);
        positionAndSalaryProofManager = new PositionAndSalaryProofManager(positionAndSalaryProof1024Verifier, positionAndSalaryProof2048Verifier);

        vm.stopBroadcast();

        /// @dev - Logs of the deployed-contracts on Base Sepolia Testnet
        console.logString("Logs of the deployed-contracts on BASE Sepolia Testnet");
        console.logString("\n");
        console.log("%s: %s", "PositionAndSalaryProof1024Verifier SC", address(positionAndSalaryProof1024Verifier));
        console.logString("\n");
        console.log("%s: %s", "PositionAndSalaryProof2048Verifier SC", address(positionAndSalaryProof2048Verifier));
        console.logString("\n");
        console.log("%s: %s", "PositionAndSalaryProofManager SC", address(positionAndSalaryProofManager));
        console.logString("\n");
    }
}



/////////////////////////////////////////
/// CLI (icl. SC sources) - New version
//////////////////////////////////////

// forge script script/DeploymentAllContracts.s.sol --broadcast --private-key <BASE_TESTNET_PRIVATE_KEY> \
//     ./circuits/target/contract.sol:UltraVerifier \
//     ./Starter.sol:Starter --skip-simulation
