pragma solidity >=0.8.21;

import "forge-std/Script.sol";

/// @dev - ZK circuit, which is generated in Noir.
import { HonkVerifier } from "../../../src/circuits/circuit-for-zkemail-1024-bit-dkim/honk-verifier/honk_vk_for_1024-bit-dkim.sol";
import { PositionAndSalaryProof1024Verifier } from "../../../src/circuits/circuit-for-zkemail-1024-bit-dkim/PositionAndSalaryProof1024Verifier.sol";


/**
 * @notice - Deployment script to deploy the PositionAndSalaryProof1024Verifier contract on BASE Testnet
 */
contract DeploymentForPositionAndSalaryProof1024Verifier is Script {
    HonkVerifier public verifier;
    PositionAndSalaryProof1024Verifier public positionAndSalaryProof1024Verifier;

    function setUp() public {}

    function run() public {
        vm.createSelectFork("base_testnet");
        uint256 deployerPrivateKey = vm.envUint("BASE_TESTNET_PRIVATE_KEY");
        //uint256 deployerPrivateKey = vm.envUint("LOCALHOST_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        //vm.startBroadcast();
        
        address HONKVERIFIER_1024_ON_BASE_TESTNET = vm.envAddress("HONKVERIFIER_1024_ON_BASE_TESTNET");
        verifier = HonkVerifier(HONKVERIFIER_1024_ON_BASE_TESTNET);
        //verifier = new HonkVerifier();
        positionAndSalaryProof1024Verifier = new PositionAndSalaryProof1024Verifier(verifier);

        vm.stopBroadcast();

        /// @dev - Logs of the deployed-contracts on Base Sepolia Testnet
        console.logString("Logs of the deployed-contracts on BASE Sepolia Testnet");
        console.logString("\n");
        console.log("%s: %s", "UltraVerifier SC (1024)", address(verifier));
        console.logString("\n");
        console.log("%s: %s", "PositionAndSalaryProof1024Verifier SC", address(positionAndSalaryProof1024Verifier));
        console.logString("\n");
    }
}



/////////////////////////////////////////
/// CLI (icl. SC sources) - New version
//////////////////////////////////////

// forge script script/DeploymentAllContracts.s.sol --broadcast --private-key <BASE_TESTNET_PRIVATE_KEY> \
//     ./circuits/target/contract.sol:UltraVerifier \
//     ./Starter.sol:Starter --skip-simulation
