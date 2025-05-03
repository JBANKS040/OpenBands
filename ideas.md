Ressources:
Check out zkemail.nr
https://registry.zk.email/


Features:

- nullifier, only 1 submission per email???
- verified position with zkemail through email signatures
- !!! verified salary with zkemail through email body content/ PDF better but expensive (long proving time)
- I wonder if you could connect with http://openbanking.nr so that salaries are constrained too 🤔


- generate key and post submission later, e.g. after leaving the company
- personal company feedback pro/con: text field

- compare salaries with coworker without disclosing it. Only reveal whos is higher // yaos millionaire problem

- aggregated data. show salaries for a company only if 10+ submissions are reached
Aggregation is a trivial MPC task. No performance bottlenecks, no trusted party. Everyone submits encrypted data, and the system reveals only the group statistics. No one ever sees individual salaries—not even during computation.


- To make it even stronger, you can layer in differential privacy.
This adds noise in a controlled way, so even if someone tries to reverse-engineer individual entries from the aggregate, it doesn’t work.
https://desfontain.es/blog/friendly-intro-to-differential-privacy.html


Salary proof with reclaim protocol??

https://x.com/reclaimprotocol/status/1915448489653490135
https://dev.reclaimprotocol.org/