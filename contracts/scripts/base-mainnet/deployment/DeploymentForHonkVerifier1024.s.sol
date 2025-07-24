pragma solidity >=0.8.21;

import "forge-std/Script.sol";

/// @dev - ZK circuit, which is generated in Noir.
import { HonkVerifier } from "../../../src/circuits/circuit-for-zkemail-1024-bit-dkim/honk-verifier/honk_vk_for_1024-bit-dkim.sol";
//import { PositionAndSalaryProof1024Verifier } from "../../../src/circuits/circuit-for-zkemail-1024-bit-dkim/PositionAndSalaryProof1024Verifier.sol";


/**
 * @notice - Deployment script to deploy the PositionAndSalaryProof1024Verifier contract on BASE Mainnet
 * @dev - [CLI]: Using the CLI, which is written in the bottom of this file, to deploy all SCs
 */
contract DeploymentForHonkVerifier1024 is Script {
    //using SafeERC20 for MockRewardToken;

    HonkVerifier public verifier;
    //PositionAndSalaryProof1024Verifier public positionAndSalaryProof1024Verifier;

    function setUp() public {}

    function run() public {
        vm.createSelectFork("base_mainnet");
        uint256 deployerPrivateKey = vm.envUint("BASE_MAINNET_PRIVATE_KEY");
        //uint256 deployerPrivateKey = vm.envUint("LOCALHOST_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        //vm.startBroadcast();
        verifier = new HonkVerifier();
        //positionAndSalaryProof1024Verifier = new PositionAndSalaryProof1024Verifier(verifier);

        vm.stopBroadcast();

        /// @dev - Logs of the deployed-contracts on Base mainnet
        console.logString("Logs of the deployed-contracts on BASE mainnet");
        console.logString("\n");
    }
}



/////////////////////////////////////////
/// CLI (icl. SC sources) - New version
//////////////////////////////////////

// forge script script/DeploymentAllContracts.s.sol --broadcast --private-key <BASE_TESTNET_PRIVATE_KEY> \
//     ./circuits/target/contract.sol:UltraVerifier \
//     ./Starter.sol:Starter --skip-simulation
