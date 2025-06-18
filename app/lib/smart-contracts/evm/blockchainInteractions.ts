import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

/** 
 * @dev - [TODO]: Define the functions by using the following ethers.js methods:
 * @dev - ref: https://docs.ethers.org/v6/getting-started/#starting-blockchain
 */

// // Look up the current block number (i.e. height)
// await provider.getBlockNumber()
// // 22692902

// // Get the current balance of an account (by address or ENS name)
// balance = await provider.getBalance("ethers.eth")
// // 4085267032476673080n

// // Since the balance is in wei, you may wish to display it
// // in ether instead.
// formatEther(balance)
// // '4.08526703247667308'

// // Get the next nonce required to send a transaction
// await provider.getTransactionCount("ethers.eth")
// // 2