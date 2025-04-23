/**
 * Represents a company where users can post salary information without revealing their identity
 */
export interface Company {
  /** Unique identifier for the company (e.g: company domain) */
  id: string;
  /** Display name of the company */
  title: string;
  /** URL to the company's logo image */
  logoUrl: string;
}

/**
 * Represents a salary entry posted by a company employee
 */
export interface SalaryEntry {
  /** Unique identifier for the salary entry */
  id: string;
  /** ID of the company the corresponding user belongs to */
  companyId: string;
  /** Name of the provider that generated the proof that the user (user's ephemeral pubkey) belongs to the company */
  companyProvider: string;
  /** Position at the company */
  position: string;
  /** Salary at the company */
  salary: string;
  /** Unix timestamp when the entry was created */
  timestamp: Date;
  /** Number of likes entry received */
  likes: number;
}

/**
 * Ephemeral key pair generated and stored in the browser's local storage
 * This key is used to sign messages.
 */
export interface EphemeralKey {
  privateKey: bigint;
  publicKey: bigint;
  salt: bigint;
  expiry: Date;
  ephemeralPubkeyHash: bigint;
}

/**
 * Provider interface for generating and verifying ZK proofs of company membership
 * Example: Google (for "people in a company")
 */
export interface CompanyProvider {
  /** Get the provider's unique identifier */
  name(): string;

  /** Slug is a key that represents the type of the company identifier (to be used in URLs). Example: "domain" */
  getSlug(): string;

  /**
   * Generate a ZK proof that the current user is a member of a company
   * @param ephemeralKey - The ephemeral key pair generated for the user
   * @param position - The position at the company
   * @param salary - The salary at the company
   * @returns Returns the company and membership proof, along with additional args that may be needed for verification
   */
  generateProof(
    ephemeralKey: EphemeralKey,
    position: string,
    salary: string
  ): Promise<{
    proof: Uint8Array;
    company: Company;
    proofArgs: object;
  }>;

  /**
   * Verify a ZK proof of company membership
   * @param proof - The ZK proof to verify
   * @param companyId - ID of the company that the proof claims membership in
   * @param ephemeralPubkey - Pubkey modulus of the ephemeral key that was used when generating the proof
   * @param ephemeralPubkeyExpiry - Expiry of the ephemeral pubkey
   * @param proofArgs - Additional args that was returned when the proof was generated
   * @returns Promise resolving to true if the proof is valid
   */
  verifyProof(
    proof: Uint8Array,
    companyId: string,
    ephemeralPubkey: bigint,
    ephemeralPubkeyExpiry: Date,
    proofArgs: object
  ): Promise<boolean>;

  /**
   * Get the company by its unique identifier
   * @param companyId - Unique identifier for the company
   * @returns Promise resolving to the company
   */
  getCompany(companyId: string): Company;
}

export interface SignedSalaryEntry extends SalaryEntry {
  /** Ed25519 signature of the entry - signed by the user's ephemeral private key (in hex format) */
  signature: bigint;
  /** Ed25519 pubkey that can verify the signature */
  ephemeralPubkey: bigint;
  /** Expiry of the ephemeral pubkey */
  ephemeralPubkeyExpiry: Date;
}

export interface SignedSalaryEntryWithProof extends SignedSalaryEntry {
  /** ZK proof that the sender belongs to the company */
  proof: Uint8Array;
  /** Additional args that was returned when the proof was generated */
  proofArgs: object;
}

export const LocalStorageKeys = {
  EphemeralKey: "ephemeralKey",
  CurrentCompanyId: "currentCompanyId",
  CurrentProvider: "currentProvider",
  GoogleOAuthState: "googleOAuthState",
  GoogleOAuthNonce: "googleOAuthNonce",
  MicrosoftOAuthState: "microsoftOAuthState",
  MicrosoftOAuthNonce: "microsoftOAuthNonce",
  DarkMode: "darkMode",
  HasSeenWelcomeMessage: "hasSeenWelcomeMessage",
};

export interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string;
}

export interface CompanyRatings {
  work_life_balance: number;
  culture_values: number;
  career_growth: number;
  compensation_benefits: number;
  leadership_quality: number;
  operational_efficiency: number;
} 