# zkLevels


zkLevels is a Levels/Glassdoor style app where users can sign in with their gmail work account and prove affiliation with a company without disclosing their identity.

After sign in the user has the possibility to disclose the position at the company and the respective salary for this position.

We will work with zkJWT and Noir language to write the circuits.
We will generate a offchain verifier to verify proofs. 


Ressources:
https://saleel.xyz/blog/stealthnote/
https://github.com/zkemail/noir-jwt


Some questions I asked the founder of Stealthnote and ideas we might use for our zkLevels:

> so I can use Stealthnote github as reference right?
yes, Stealthnote is a bit complex in the sense that it is somewhat generic to accept any proof of anonymity group; but you should be able to use some snippets.
Using jwt-library might be more convenient

> So the message and jwt are binded?
yes, but there is another level of indirection where you are binding the public key of a temporarily generated keypair instead
and then use that ephemeral key to sign messages

this way you generate on ZK proof and can post any number of messages

> The proof would include these inputs: position, salary and jwt?
yes; not sure if you need keypair abstraction like above as one person only needs to post once
1:02 PM

> But where does verification happen? Whats the pro and cons of not deploying on a blockchain?

I am saving the messages to a centralized server in a postgres database
So there is a liveness/censorship assumption on the server - i.e server can remove some messages, but it cannot create fake messages from any company (as the proof is verifiable by users in the frontend)

A smart contract verifying proof and storing/emiting event is great as its censorship resistant and always live; something i might do in the future, if this turns in to some serious whistleblowing app

the cons are the gas cost and UX; someone has to pay for the tx cost, and it might not be fun if we ask users to pay; if I pay for all messages with some account abstraction, there is a potential DDOS attack vector on my faucet

