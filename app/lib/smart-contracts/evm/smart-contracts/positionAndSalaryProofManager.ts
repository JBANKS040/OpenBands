import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

// @dev - Blockchain related imports
//import { connectToEvmWallet } from '../lib/smart-contracts/evm/connectToEvmWallet';
//import artifactOfPositionAndSalaryProofManager from '../lib/smart-contracts/evm/smart-contracts/artifacts/PositionAndSalaryProofManager.sol/PositionAndSalaryProofManager.json';
//import { recordPublicInputsOfPositionAndSalaryProof } from '../lib/smart-contracts/evm/smart-contracts/positionAndSalaryProofManager';
import { encodeBase64, toUtf8Bytes, zeroPadBytes, parseEther } from 'ethers';
//import { EthereumProvider, Window } from "../dataTypes";

import { uint8ArrayToHex } from "../../../converters/uint8ArrayProofToHexStringProofConverter";


/**
 * @notice - PositionAndSalaryProofManager# recordPublicInputsOfPositionAndSalaryProof()
 */
export async function storePublicInputsOfPositionAndSalaryProof(
  signer: any,
  abi: Array<any>, 
  positionAndSalaryProofManagerContractAddress: string,
  proof: any,
  publicInputs: Array<any>,
  separatedPublicInputs: any,
  rsaSignatureLength: number
): Promise<{ txReceipt: any }> {
  // @dev - TEST
  const isValidProof = await verifyProof(
    signer,
    uint8ArrayToHex(proof), // Convert Uint8Array proof to hex string proof
    publicInputs
  );
  console.log(`isValidProof (TEST): ${isValidProof}`);

  // Connected to a Signer; can make state changing transactions, which will cost the account ether
  const positionAndSalaryProofManager = new Contract(positionAndSalaryProofManagerContractAddress, abi, signer);

  // @dev - Convert Uint8Array proof to hex string proofHex
  const proofHex = uint8ArrayToHex(proof);
  console.log(`proofHex: ${proofHex}`);

  let tx: any;
  let txReceipt: any;
  try {
    // Send the transaction
    tx = await positionAndSalaryProofManager.recordPublicInputsOfPositionAndSalaryProof(
      proofHex,
      //proof, 
      publicInputs, 
      separatedPublicInputs,
      rsaSignatureLength
      //{ value: parseEther("0.001") }  // @dev - Send a TX with 0.01 ETH -> This is not a gas fee. Hence, this is commented out.
    );
    
    // Wait for the transaction to be included.
    txReceipt = await tx.wait();
  } catch (err) {
    console.error(`Failed to send a transaction: ${err}`);
    throw new Error(`Failed to send a transaction: ${err}`); // @dev - To display a full error message on UI
  }

  return { txReceipt };
}



export async function verifyProof(signer: any, proofHex: any, publicInputs: any): bool {
  // 1. Setup provider and contract
  //const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
  const verifierAddress = "0x1c501E0e73157c39dfa5f5eCe0EC25C70b522bF9";
  //const verifierAddress = "YOUR_VERIFIER_CONTRACT_ADDRESS";
  const verifierAbi = [
    "function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool)"
  ];
  const verifier = new Contract(verifierAddress, verifierAbi, signer);
  //const verifier = new ethers.Contract(verifierAddress, verifierAbi, provider);

  // 2. Prepare proof and public inputs
  // const proofHex = "0x..."; // Your hex string proof
  // const publicInputs = [
  //   "0x...", // Each should be a 32-byte hex string
  //   // ...
  // ];

  const isValid = await verifier.verify(proofHex, publicInputs);
  console.log("Proof valid?", isValid);
}
