//import init, { get_limbs } from "@shieldswap/email_account_utils_rs";
import { get_limbs } from "@shieldswap/email_account_utils_rs";


/**
 * @notice - Converts the public key and signature to limbs
 */
export async function convertToPubkeyLimbsAndSignatureLimbs(
    publicKey,
    dkimHeader,
) {
    await init(); // initialize the wasm module

    // base64 encoded public key from email provider
    //const publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1ZEfbkf4TbO2TDZI67WhJ6G8Dwk3SJyAbBlE/QKdyXFZB4HfEU7AcuZBzcXSJFE03DlmyOkUAmaaR8yFlwooHyaKRLIaT3epGlL5YGowyfItLly2k0Jj0IOICRxWrB378b7qMeimE8KlH1UNaVpRTTi0XIYjIKAOpTlBmkM9a/3Rl4NWy8pLYApXD+WCkYxPcxoAAgaN8osqGTCJ5r+VHFU7Wm9xqq3MZmnfo0bzInF4UajCKjJAQa+HNuh95DWIYP/wV77/PxkEakOtzkbJMlFJiK/hMJ+HQUvTbtKW2s+t4uDK8DI16Rotsn6e0hS8xuXPmVte9ZzplD0fQgm2qwIDAQAB";

    const signatureBase64 = dkimHeader.b.replace(/\s/g, "");
    console.log(`signatureBase64: ${signatureBase64}`);

    //let public_key_limbs, public_key_redc_limbs, signature_limbs;
    const { public_key_limbs, public_key_redc_limbs, signature_limbs } = JSON.parse(get_limbs(publicKey, signatureBase64));
    console.log("public_key_limbs", "[" + public_key_limbs.join(",") + "]");
    console.log("public_key_redc_limbs", "[" + public_key_redc_limbs.join(",") + "]", );
    console.log("signature_limbs", "[" + signature_limbs.join(",") + "]");

    return { public_key_limbs, public_key_redc_limbs, signature_limbs };
}