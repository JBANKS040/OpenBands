pragma solidity >=0.8.21;

import "forge-std/Script.sol";

/// @dev - ZK circuit, which is generated in Noir.
import { HonkVerifier } from "../../../src/circuits/circuit-for-zkemail-2048-bit-dkim/honk-verifier/plonk_vk_for_2048-bit-dkim.sol";
import { PositionAndSalaryProof2048Verifier } from "../../../src/circuits/circuit-for-zkemail-2048-bit-dkim/PositionAndSalaryProof2048Verifier.sol";


/**
 * @notice - Deployment script to deploy the PositionAndSalaryProof2048Verifier contract on BASE Testnet
 * @dev - [CLI]: Using the CLI, which is written in the bottom of this file, to deploy all SCs
 */
contract DeploymentForHonkVerifier2048 is Script {
    //using SafeERC20 for MockRewardToken;

    HonkVerifier public verifier;
    PositionAndSalaryProof2048Verifier public positionAndSalaryProof2048Verifier;

    function setUp() public {}

    function run() public {
        vm.createSelectFork("base_testnet");
        uint256 deployerPrivateKey = vm.envUint("BASE_TESTNET_PRIVATE_KEY");
        //uint256 deployerPrivateKey = vm.envUint("LOCALHOST_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        //vm.startBroadcast();
        verifier = new HonkVerifier();
        positionAndSalaryProof2048Verifier = new PositionAndSalaryProof2048Verifier(verifier);

        vm.stopBroadcast();

        /// @dev - Logs of the deployed-contracts on Base Sepolia Testnet
        console.logString("Logs of the deployed-contracts on BASE Sepolia Testnet");
        console.logString("\n");
    }
}



/////////////////////////////////////////
/// CLI (icl. SC sources) - New version
//////////////////////////////////////

// forge script script/DeploymentAllContracts.s.sol --broadcast --private-key <BASE_TESTNET_PRIVATE_KEY> \
//     ./circuits/target/contract.sol:UltraVerifier \
//     ./Starter.sol:Starter --skip-simulation
