import { ethers, Contract } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

// @dev - Blockchain related imports
//import { connectToEvmWallet } from '../lib/smart-contracts/evm/connectToEvmWallet';
//import artifactOfPositionAndSalaryProofManager from '../lib/smart-contracts/evm/smart-contracts/artifacts/PositionAndSalaryProofManager.sol/PositionAndSalaryProofManager.json';
//import { recordPublicInputsOfPositionAndSalaryProof } from '../lib/smart-contracts/evm/smart-contracts/positionAndSalaryProofManager';
import { encodeBase64, toUtf8Bytes, zeroPadBytes } from 'ethers';
//import { EthereumProvider, Window } from "../dataTypes";


/**
 * @notice - PositionAndSalaryProofManager# recordPublicInputsOfPositionAndSalaryProof()
 */
export async function storePublicInputsOfPositionAndSalaryProof(
  signer: any,
  abi: Array<any>, 
  positionAndSalaryProofManagerContractAddress: string,
  proof: any,
  jwtPubkeyModulusLimbs: Array<any>,
  domain: string, 
  position: string, 
  salary: string, 
  ratings: any,
  nullifierHash: string,
  rsaSignatureLength: number,
  //params: Array<any>, 
): Promise<{ txReceipt: any }> {
  // abi = [
  //   "function transfer(address to, uint amount)"
  // ]

  let domainBase64 = encodeBase64(toUtf8Bytes(domain));
  let positionBase64 = encodeBase64(toUtf8Bytes(position));
  let salaryBase64 = encodeBase64(toUtf8Bytes(salary));
  //let ratingsBase64 = encodeBase64(toUtf8Bytes(JSON.stringify(ratings)));
  let ratingsBase64 = {
    work_life_balance: encodeBase64(toUtf8Bytes(String(ratings.work_life_balance))),  // @dev - [TODO]: Convert data type from "Number" to "String"
    culture_values: encodeBase64(toUtf8Bytes(String(ratings.culture_values))),
    career_growth: encodeBase64(toUtf8Bytes(String(ratings.career_growth))),
    compensation_benefits: encodeBase64(toUtf8Bytes(String(ratings.compensation_benefits))),
    leadership_quality: encodeBase64(toUtf8Bytes(String(ratings.leadership_quality))),
    operational_efficiency: encodeBase64(toUtf8Bytes(String(ratings.operational_efficiency)))
  };
  let domainBytes = Uint8Array.from(domainBase64);
  let positionBytes = Uint8Array.from(positionBase64);
  let salaryBytes = Uint8Array.from(salaryBase64);
  //let ratingsBytes = Uint8Array.from(ratingsBase64);
  let ratingsBytes = {
    work_life_balance: Uint8Array.from(ratingsBase64.work_life_balance),
    culture_values: Uint8Array.from(ratingsBase64.culture_values),
    career_growth: Uint8Array.from(ratingsBase64.career_growth),
    compensation_benefits: Uint8Array.from(ratingsBase64.compensation_benefits),
    leadership_quality: Uint8Array.from(ratingsBase64.leadership_quality),
    operational_efficiency: Uint8Array.from(ratingsBase64.operational_efficiency)
  }
  let domainBytes32 = zeroPadBytes(domainBytes, 32);      // @dev - Zero-pad to 32 bytes
  let positionByte32 = zeroPadBytes(positionBytes, 32);   // @dev - Zero-pad to 32 bytes
  let salaryBytes32 = zeroPadBytes(salaryBytes, 32);      // @dev - Zero-pad to 32 bytes
  //let ratingsBytes32 = zeroPadBytes(ratingsBytes, 32);  // @dev - Zero-pad to 32 bytes
  let ratingsBytes32 = {
    work_life_balance: zeroPadBytes(ratingsBytes.work_life_balance, 32),          // @dev - Zero-pad to 32 bytes,
    culture_values: zeroPadBytes(ratingsBytes.culture_values, 32),                // @dev - Zero-pad to 32 bytes,
    career_growth: zeroPadBytes(ratingsBytes.career_growth, 32),                  // @dev - Zero-pad to 32 bytes,
    compensation_benefits: zeroPadBytes(ratingsBytes.compensation_benefits, 32),  // @dev - Zero-pad to 32 bytes,
    leadership_quality: zeroPadBytes(ratingsBytes.leadership_quality, 32),        // @dev - Zero-pad to 32 bytes,
    operational_efficiency: zeroPadBytes(ratingsBytes.operational_efficiency, 32) // @dev - Zero-pad to 32 bytes,
  };

  // ratings: {
  //   "work_life_balance": 3,
  //   "culture_values": 3,
  //   "career_growth": 3,
  //   "compensation_benefits": 3,
  //   "leadership_quality": 3,
  //   "operational_efficiency": 3
  // }

  let publicInputs: Array<any> = [
    jwtPubkeyModulusLimbs,
    domainBytes32, 
    positionByte32, 
    salaryBytes32, 
    //ratingsBytes32
    ratingsBytes32.work_life_balance,
    ratingsBytes32.culture_values,
    ratingsBytes32.career_growth,
    ratingsBytes32.compensation_benefits,
    ratingsBytes32.leadership_quality,
    ratingsBytes32.operational_efficiency,
    nullifierHash
  ];
  //let publicInputs: Array<any> = [domain, position, salary, ratings];
  let params: Array<any> = [
    positionAndSalaryProofManagerContractAddress, 
    proof, 
    publicInputs, 
    rsaSignatureLength
  ];


  // @dev - Store the parameters into variables
  //const positionAndSalaryProofManagerContractAddress = params[0];
  //const proof = params[1];
  //const publicInputs = params[2];
  //const rsaSignatureLength = params[3];

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