pragma solidity >=0.8.21;

import "forge-std/Script.sol";

/// @dev - ZK circuit, which is generated in Noir.
import { PositionAndSalaryProof1024Verifier } from "../../../src/circuits/circuit-for-zkemail-1024-bit-dkim/PositionAndSalaryProof1024Verifier.sol";
import { PositionAndSalaryProof2048Verifier } from "../../../src/circuits/circuit-for-zkemail-2048-bit-dkim/PositionAndSalaryProof2048Verifier.sol";
import { PositionAndSalaryProofManager } from "../../../src/circuits/PositionAndSalaryProofManager.sol";

//import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


/**
 * @notice - Deployment script to deploy all SCs at once on BASE Mainnet
 * @dev - [CLI]: Using the CLI, which is written in the bottom of this file, to deploy all SCs
 */
contract DeploymentAllContracts is Script {
    //using SafeERC20 for MockRewardToken;

    PositionAndSalaryProof1024Verifier public prositionAndSalaryProof1024Verifier;
    PositionAndSalaryProof2048Verifier public positionAndSalaryProof2048Verifier;
    PositionAndSalaryProofManager public positionAndSalaryProofManager;

    function setUp() public {}

    function run() public {
        vm.createSelectFork("base_mainnet");
        uint256 deployerPrivateKey = vm.envUint("BASE_MAINNET_PRIVATE_KEY");
        //uint256 deployerPrivateKey = vm.envUint("LOCALHOST_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        //vm.startBroadcast();
        address POSITION_AND_SALARY_PROOF_1024_VERIFIER = vm.envAddress("POSITION_AND_SALARY_PROOF_1024_VERIFIER_ON_BASE_MAINNET");
        address POSITION_AND_SALARY_PROOF_2048_VERIFIER = vm.envAddress("POSITION_AND_SALARY_PROOF_2048_VERIFIER_ON_BASE_MAINNET");
        positionAndSalaryProofManager = new PositionAndSalaryProofManager(PositionAndSalaryProof1024Verifier(POSITION_AND_SALARY_PROOF_1024_VERIFIER), PositionAndSalaryProof2048Verifier(POSITION_AND_SALARY_PROOF_2048_VERIFIER));

        vm.stopBroadcast();

        /// @dev - Logs of the deployed-contracts on Base Mainnet
        console.logString("Logs of the deployed-contracts on Base Mainnet");
        console.logString("\n");
    }
}



/////////////////////////////////////////
/// CLI (icl. SC sources) - New version
//////////////////////////////////////

// forge script script/DeploymentAllContracts.s.sol --broadcast --private-key <BASE_TESTNET_PRIVATE_KEY> \
//     ./circuits/target/contract.sol:UltraVerifier \
//     ./Starter.sol:Starter --skip-simulation
