import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

import { EthereumProvider, Window } from "./dataTypes";



/**
 * @notice - State-changing Methods
 * @dev - ref). https://docs.ethers.org/v6/getting-started/#starting-contracts
 */
export async function callStateChangeFunction(abi: Array, params: Array, signer: any ): Promise<{ txReceipt: any }> {
  // abi = [
  //   "function transfer(address to, uint amount)"
  // ]

  // @dev - Store the parameters into variables
  const _contractAddress = params[0];
  const _to = params[1];
  const _amount = params[2];

  // Connected to a Signer; can make state changing transactions,
  // which will cost the account ether
  const contract = new Contract(_contractAddress, abi, signer);
  //const contract = new Contract("dai.tokens.ethers.eth", abi, signer);

  // Send 1 DAI
  const amount = parseUnits(_amount, 18);
  //const amount = parseUnits("1.0", 18);

  // Send the transaction
  const tx = await contract.transfer(_to, amount);
  //const tx = await contract.transfer("ethers.eth", amount);

  // Currently the transaction has been sent to the mempool,
  // but has not yet been included. So, we...

  // ...wait for the transaction to be included.
  const txReceipt = await tx.wait();

  return { txReceipt };
}



// @dev - Read-only methods (i.e. view and pure)
// @dev - ref: https://docs.ethers.org/v6/getting-started/#starting-contracts

// // The contract ABI (fragments we care about)
// abi = [
//   "function decimals() view returns (uint8)",
//   "function symbol() view returns (string)",
//   "function balanceOf(address a) view returns (uint)"
// ]

// // Create a contract; connected to a Provider, so it may
// // only access read-only methods (like view and pure)
// contract = new Contract("dai.tokens.ethers.eth", abi, provider)

// // The symbol name for the token
// sym = await contract.symbol()
// // 'DAI'

// // The number of decimals the token uses
// decimals = await contract.decimals()
// // 18n

// // Read the token balance for an account
// balance = await contract.balanceOf("ethers.eth")
// // 4000000000000000000000n

// // Format the balance for humans, such as in a UI
// formatUnits(balance, decimals)
// // '4000.0'