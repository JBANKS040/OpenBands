import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

// @dev - Blockchain related imports
import artifactOfHonkVerifier2048 from './artifacts/honk_vk_for_2048-bit-dkim.sol/HonkVerifier.json';
//import { encodeBase64, toUtf8Bytes, zeroPadBytes, parseEther } from 'ethers';
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

  // @dev - TEST
  const isValidProof = await verifyProof(
    signer,
    proofHex, 
    publicInputs
  );
  console.log(`isValidProof (TEST): ${JSON.stringify(isValidProof, null, 2)}`);

  // @dev - Call the recordPublicInputsOfPositionAndSalaryProof() function in the PositionAndSalaryProofManager.sol
  let tx: any;
  let txReceipt: any;
  try {
    tx = await positionAndSalaryProofManager.recordPublicInputsOfPositionAndSalaryProof(
      proofHex, 
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


/**
 * @notice - HonkVerifier# verify()
 */
export async function verifyProof(signer: any, proofHex: any, publicInputs: any): Promise<{ isValidProof: boolean }> {
  // @dev - Store the deployed HonkVerifier contract address and its ABI
  const honkVerifier2048Address: string = process.env.NEXT_PUBLIC_HONKVERIFIER_2048_ON_BASE_TESTNET || "";
  const honkVerifier2048Abi: Array<any> = artifactOfHonkVerifier2048.abi; 

  // @dev - Create the HonkVerifier contract instance
  const verifier = new Contract(honkVerifier2048Address, honkVerifier2048Abi, signer);
  
  // @dev - Call the verify() in the HonkVerifier.sol
  const isValidProof = await verifier.verify(proofHex, publicInputs);
  console.log("Proof valid?", isValidProof);

  return { isValidProof };
}
