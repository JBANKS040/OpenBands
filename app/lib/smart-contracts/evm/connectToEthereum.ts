import { ethers } from "ethers";
import { BrowserProvider, parseUnits } from "ethers";
import { HDNodeWallet } from "ethers/wallet";

import { EthereumProvider, Window } from "./dataTypes";

// @dev - The global declaration for the EthereumProvider interface.
// declare global {
//   interface EthereumProvider {
//     request: (...args: any[]) => Promise<any>;
//     // add more methods as needed
//   }

//   interface Window {
//     ethereum?: EthereumProvider;
//   }
// }

/**
 * @notice - Connect to Ethereum
 * @dev - ref). https://docs.ethers.io/v6/getting-started/#getting-started-connecting
 */
export async function connectToEthereum(provider: EthereumProvider): Promise<{ provider: any, signer: any }> {
  let signer: any = null;
  //let provider: any = null;

  let window: Window = { ethereum: provider || null };

  if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider, which is backed by a variety of third-party services (such as INFURA). 
    // They do not have private keys installed, so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
  } else {
    // Connect to the MetaMask EIP-1193 object. 
    // This is a standard protocol that allows Ethers access to make all read-only requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write operations, which will be performed by the private key that MetaMask manages for the user.
    signer = await provider.getSigner();
  }

  return { provider, signer }; // Return the resolved value
}




//////////////////////////////////////////////////////////////////// 
// Example usage of ethers.js utilities (v6) for unit conversions //
////////////////////////////////////////////////////////////////////

// // Convert user-provided strings in ether to wei for a value
// eth = parseEther("1.0")
// // 1000000000000000000n

// // Convert user-provided strings in gwei to wei for max base fee
// feePerGas = parseUnits("4.5", "gwei")
// // 4500000000n

// // Convert a value in wei to a string in ether to display in a UI
// formatEther(eth)
// // '1.0'

// // Convert a value in wei to a string in gwei to display in a UI
// formatUnits(feePerGas, "gwei")
// // '4.5'