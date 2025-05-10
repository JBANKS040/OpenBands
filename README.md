# OpenBands

OpenBands is a privacy-preserving company reviews and salary reports platform.

We use Zero Knowledge Proofs to verify that users have valid Google Workspace accounts from their claimed organizations, while keeping email addresses and personal details private. This allows employees to share salary information without fear of retaliation or identification.

Introduction video: [Introduction Video](https://www.loom.com/share/3e7c91f192be4761bd7871708effc383?sid=bbe7f84d-2a0c-4864-a276-8a5faef0bd59)
Try it out at [open-bands.vercel.app](https://open-bands.vercel.app)

## Privacy Primitives Used

We use [zkJWT](https://github.com/zkemail/noir-jwt) to prove the validity of a Google work email account.
We use [zkEmail](https://github.com/zkemail/zkemail.nr) to extract the position and salary from the Email Body (as a selective disclosure) by using Regex.

## How It Works

1. **Authentication**: Sign in with your work Google account
2. **Proof Generation**: Client side zero-knowledge proof generation that:
   - Verifies your Google JWT/ work email is valid
   - Verified your salary and position title through email body content
4. **Verification**: Anyone can verify that submissions come from legitimate company employees

## Notes

ACIR Opcodes: 43362
proving time: 30000ms


