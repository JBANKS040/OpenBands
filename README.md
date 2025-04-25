# OpenBands

OpenBands is a platform that enables anonymous position and salary transparency while proving company affiliation.

We use Zero Knowledge Proofs to verify that users have valid Google Workspace accounts from their claimed organizations, while keeping email addresses and personal details private. This allows employees to share salary information without fear of retaliation or identification.

Try it out at [open-bands.vercel.app](https://open-bands.vercel.app)

## How It Works

1. **Authentication**: Sign in with your work Google account
2. **Proof Generation**: We generate a zero-knowledge proof that:
   - Verifies your Google JWT is valid
   - Proves you have an email from the claimed company domain
   - Commits/binds to your position and salary
3. **Privacy**: Your email address and identity are never revealed or stored (client side proof generation)
4. **Verification**: Anyone can verify that submissions come from legitimate company employees

## Current Features
 1. verified work email with zkJWT
 2. Company star rating over 6 dimensions

**Next up:**
1. verified position and salary with zkEmail


## Helpful Ressources

1. https://github.com/zkemail/noir-jwt
2. https://saleel.xyz/blog/stealthnote/
3. https://jwt.io/

