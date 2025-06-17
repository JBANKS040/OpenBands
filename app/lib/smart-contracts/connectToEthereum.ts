// Import everything
import { ethers } from "ethers";

// Import just a few select items
import { BrowserProvider, parseUnits } from "ethers";

// Import from a specific export
import { HDNodeWallet } from "ethers/wallet";

/**
 * @notice - Connect to Ethereum
 */
export async function connectToEthereum(): Promise<{ provider: any, signer: any }> {
    let signer: any = null;
    let provider: any;

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