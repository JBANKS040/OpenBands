import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

//import { EthereumProvider, Window } from "../dataTypes";


/**
 * @notice - PositionAndSalaryProofManager# recordPublicInputsOfPositionAndSalaryProof()
 */
export async function recordPublicInputsOfPositionAndSalaryProof(
  abi: Array<any>, 
  params: Array<any>, 
  signer: any
): Promise<{ txReceipt: any }> {
  // abi = [
  //   "function transfer(address to, uint amount)"
  // ]

  // @dev - Store the parameters into variables
  const positionAndSalaryProofManagerContractAddress = params[0];
  const proof = params[1];
  const publicInputs = params[2];
  const rsaSignatureLength = params[3];

  // Connected to a Signer; can make state changing transactions,
  // which will cost the account ether
  const positionAndSalaryProofManager = new Contract(positionAndSalaryProofManagerContractAddress, abi, signer);

  // Send the transaction
  const tx = await positionAndSalaryProofManager.recordPublicInputsOfPositionAndSalaryProof(proof, publicInputs, rsaSignatureLength);

  // Currently the transaction has been sent to the mempool,
  // but has not yet been included. So, we...

  // ...wait for the transaction to be included.
  const txReceipt = await tx.wait();

  return { txReceipt };
}