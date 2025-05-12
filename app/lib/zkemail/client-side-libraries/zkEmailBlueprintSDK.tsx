import { ZkEmailSDKProvider } from "@zk-email/zk-email-sdk";


/**
 * @notice - [NOTE]: 
 */
export async function extractEmailVerifierInputs(
    rawEmail: string,
    //rawEmail: Buffer | string,
    params: InputGenerationArgs = {}
): Promise<{ header: string; body: string }> {
}