import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

// @dev - Blockchain related imports
//import { connectToEvmWallet } from '../lib/smart-contracts/evm/connectToEvmWallet';
//import artifactOfPositionAndSalaryProofManager from '../lib/smart-contracts/evm/smart-contracts/artifacts/PositionAndSalaryProofManager.sol/PositionAndSalaryProofManager.json';
import artifactOfHonkVerifier2048 from './artifacts/honk_vk_for_2048-bit-dkim.sol/HonkVerifier.json';
//import { recordPublicInputsOfPositionAndSalaryProof } from '../lib/smart-contracts/evm/smart-contracts/positionAndSalaryProofManager';
import { encodeBase64, toUtf8Bytes, zeroPadBytes, parseEther } from 'ethers';
//import { EthereumProvider, Window } from "../dataTypes";

import { proofToUint8Array } from "./utils/proofToUint8ArrayConverter";
import { uint8ArrayToHex } from "./utils/uint8ArrayProofToHexStringProofConverter";
import { sliceHexStringProof } from "./utils/sliceHexStringProof";

/**
 * @notice - PositionAndSalaryProofManager# recordPublicInputsOfPositionAndSalaryProof()
 */
export async function storePublicInputsOfPositionAndSalaryProof(
  signer: any,
  abi: Array<any>, 
  positionAndSalaryProofManagerContractAddress: string,
  proof: Uint8Array<any>,
  publicInputs: Array<any>,
  separatedPublicInputs: any,
  rsaSignatureLength: number
): Promise<{ txReceipt: any }> {
  // Connected to a Signer; can make state changing transactions, which will cost the account ether
  const positionAndSalaryProofManager = new Contract(positionAndSalaryProofManagerContractAddress, abi, signer);

  // @dev - Logs of arguments
  console.log(`proof: ${proof}`);

  // @dev - Convert Uint8Array proof to hex string proofHex
  const proofHex = "0x" + Buffer.from(proof).toString("hex");
  //const proofHex = uint8ArrayToHex(proof);
  console.log(`proofHex: ${proofHex}`);

  // @dev - Cut off the first 32 bytes of the proof in hex. (NOTE: Each byte is 2 * hex characters)
  //const byteOffset = 32; // in bytes
  //const proofHexSliced = sliceHexStringProof(proofHex, byteOffset);
  //const proofHexSliced = proofHex.slice(2 + byteOffset * 2); // Remove "0x" + 64 chars (32 bytes)
  //console.log(`proofHexSliced: ${proofHexSliced}`);

  // @dev - TEST
  const isValidProof = await verifyProof(
    signer,
    //proof,
    proofHex, 
    publicInputs
    //[proofHex, publicInputs]
  );
  console.log(`isValidProof (TEST): ${isValidProof}`);

  // @dev - Call the recordPublicInputsOfPositionAndSalaryProof() function in the PositionAndSalaryProofManager.sol
  let tx: any;
  let txReceipt: any;
  try {
    tx = await positionAndSalaryProofManager.recordPublicInputsOfPositionAndSalaryProof(
      proofHex, 
      publicInputs,
      //[proofHex, publicInputs],
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


/**
 * @notice - HonkVerifier# verify()
 */
export async function verifyProof(signer: any, proofHex: any, publicInputs: any): Promise<{ isValidProof: boolean }> {
  // 1. Setup provider and contract
  //const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
  const honkVerifier2048Address: string = process.env.NEXT_PUBLIC_HONKVERIFIER_2048_ON_BASE_TESTNET || "";
  //const verifierAddress = "YOUR_VERIFIER_CONTRACT_ADDRESS";
  const honkVerifier2048Abi: Array<any> = artifactOfHonkVerifier2048.abi; 
  // const honkVerifier2048Abi = [
  //   "function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool)"
  // ];
  const verifier = new Contract(honkVerifier2048Address, honkVerifier2048Abi, signer);
  //const verifier = new ethers.Contract(verifierAddress, verifierAbi, provider);

  // 2. Prepare proof and public inputs
  // const proofHex = "0x..."; // Your hex string proof
  // const publicInputs = [
  //   "0x...", // Each should be a 32-byte hex string
  //   // ...
  // ];

  const isValidProof = await verifier.verify(proofHex, publicInputs);
  console.log("Proof valid?", isValidProof);

  return { isValidProof };
}
