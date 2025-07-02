import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

// @dev - Blockchain related imports
//import { connectToEvmWallet } from '../lib/smart-contracts/evm/connectToEvmWallet';
//import artifactOfPositionAndSalaryProofManager from '../lib/smart-contracts/evm/smart-contracts/artifacts/PositionAndSalaryProofManager.sol/PositionAndSalaryProofManager.json';
//import { recordPublicInputsOfPositionAndSalaryProof } from '../lib/smart-contracts/evm/smart-contracts/positionAndSalaryProofManager';
import { encodeBase64, toUtf8Bytes, zeroPadBytes, parseEther } from 'ethers';
//import { EthereumProvider, Window } from "../dataTypes";


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
  // Connected to a Signer; can make state changing transactions, which will cost the account ether
  const positionAndSalaryProofManager = new Contract(positionAndSalaryProofManagerContractAddress, abi, signer);

  let tx: any;
  let txReceipt: any;
  try {
    // Send the transaction
    tx = await positionAndSalaryProofManager.recordPublicInputsOfPositionAndSalaryProof(
      proof, 
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