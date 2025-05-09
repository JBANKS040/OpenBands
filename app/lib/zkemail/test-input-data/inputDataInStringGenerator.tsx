import { pubkeyModulusFromJWK } from "@/lib/utils";

/**
 * @notice - Generate an email header data in String format
 */
export function getEmailHeaderInString() {
    let HEADER = "from:runnier.leagues.0j@icloud.com\r\ncontent-type:text/plain; charset=utf-8\r\nmime-version:1.0 (Mac OS X Mail 16.0 \\(3731.500.231\\))\r\nsubject:Bitcoin\r\nmessage-id:<12800A90-4ECC-4513-9298-A33546122920@me.com>\r\ndate:Wed, 3 Apr 2024 16:23:48 +0530\r\nto:zkewtest@gmail.com\r\ndkim-signature:v=1; a=rsa-sha256; c=relaxed/relaxed; d=icloud.com; s=1a1hai; t=1712141644; bh=2JsdK4BMzzt9w4Zlz2TdyVCFc+l7vNyT5aAgGDYf7fM=; h=from:Content-Type:Mime-Version:Subject:Message-Id:Date:to; b=";
    
    return HEADER;
}

/**
 * @notice - Generate an email body data in String format
 */
export function getEmailBodyInString() {
    let BODY = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks\r\n\r\n15 years ago, Satoshi mined the first block of the Bitcoin blockchain =\r\nAfter the Bitcoin white paper appeared on October 31, 2008, on a =\r\ncryptography mailing list, the Genesis Block =E2=80=94 the first bitcoin =\r\nblock and the basis of the entire Bitcoin trading system in place to =\r\nthis day =E2=80=94 was mined on January 3, 2009.=20\r\n\r\nThe Genesis Block is also known as Block 0 or Block 1, and is still in =\r\nthe Bitcoin network, where it will remain as long as there is a computer =\r\nrunning the Bitcoin software.=20\r\n\r\nAll nodes in the Bitcoin network can consult it, even if it is at the =\r\nother end of the network with hundreds of thousands of blocks.\r\n";
    
    return BODY;
}

/**
 * @notice - Generate an RSA public key data
 */
export function getRSAPubkey() {
    let MODULUS = [
        "0xe5cf995b5ef59ce9943d1f4209b6ab",
        "0xe0caf03235e91a2db27e9ed214bcc6",
        "0xafe1309f87414bd36ed296dacfade2",
        "0xbeff3f19046a43adce46c932514988",
        "0x324041af8736e87de4358860fff057",
        "0xadcc6669dfa346f322717851a8c22a",
        "0x8b2a193089e6bf951c553b5a6f71aa",
        "0x0a570fe582918c4f731a0002068df2",
        "0x39419a433d6bfdd1978356cbca4b60",
        "0x550d695a514d38b45c862320a00ea5",
        "0x1c56ac1dfbf1beea31e8a613c2a51f",
        "0x6a30c9f22d2e5cb6934263d0838809",
        "0x0a281f268a44b21a4f77a91a52f960",
        "0x5134dc3966c8e91402669a47cc8597",
        "0x71590781df114ec072e641cdc5d224",
        "0xa1bc0f0937489c806c1944fd029dc9",
        "0x911f6e47f84db3b64c3648ebb5a127",
        "0xd5",
    ];

    let REDC = [
        "0x48a824e4ebc7e0f1059f3ecfa57c46",
        "0x5c1db23f3c7d47ad7e7d7cfda5189a",
        "0x9bb6bbbd8facf011f022fa9051aec0",
        "0x4faa4cef474bed639362ea71f7a217",
        "0x503aa50b77e24b030841a7d0615812",
        "0xbbf4e62805e1860a904c0f66a5fad1",
        "0xcbd24b72442d2ce647dd7d0a443685",
        "0x74a8839a4460c169dce7138efdaef5",
        "0xf06e09e3191b995b08e5b45182f650",
        "0x1fad4a89f8369fe10e5d4b6e149a10",
        "0xc778b15982d11ebf7fe23b4e15f105",
        "0x09ff3a4567077510c474e4ac0a21ad",
        "0x37e69e5dbb77167b73065e4c5ad6aa",
        "0xcf4774e22e7fe3a38642186f7ae74b",
        "0x6e72b5eb4c813a3b37998083aab81e",
        "0x48e7050aa8abedce5a45c169853761",
        "0xd3285e53b322b221f7bcf4f8f8ad8a",
        "0x132d",
    ];

    return { MODULUS, REDC };
}

/**
 * @notice - Generate an signature data
 */
export function getSignature() {
    let SIGNATURE = [
        "0xf193c3300b7c9902e32861c38d0d2d",
        "0x9f6927fdb3df0b84092d8459654327",
        "0x8a0bea5e2fa82821e49c27b68d5a7b",
        "0xaa8c0acc1190f9fd845ef64f8e7ae9",
        "0xa7aeebb37f4395965543e6df69a5a7",
        "0x087ecef9921569cfba83331ca11c6b",
        "0x4589ed316ed20757e65ad221736011",
        "0x0835d8748f11dcc985700c3fea27b1",
        "0xe870d2493fb83b4a1d72350e5de926",
        "0x268b28eda0aac07625cfab32b60af1",
        "0xb41a164eae7ba1602eaec5b5a39fe6",
        "0x693cc5ec578422bee48eabe390fc37",
        "0xa29504dd504f14423f2ce65b2ac388",
        "0x6c3ac6310c084a0b126fcd5225c208",
        "0xab0903e48563e5f4a5365ac5cbd888",
        "0xf05bf2e5b6266c0ac88dfc733c414f",
        "0xf58f9e9669e0f4f3086cce1187fd44",
        "0xb9",
    ];

    return SIGNATURE;
}

/**
 * @notice - Generate an body_hash_index data
 */
export function getBodyHashIndex() {
    let BODY_HASH_INDEX = 361;
    return BODY_HASH_INDEX;
}

/**
 * @notice - Generate an dkim_header_sequence data
 */
export function getDkimHeaderSequence() {
    let DKIM_HEADER_SEQUENCE = { INDEX: 267, LENGTH: 203 };
    return DKIM_HEADER_SEQUENCE;
}