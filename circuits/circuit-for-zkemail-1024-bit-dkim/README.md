## Installation - Noir and Foundry

Install [noirup](https://noir-lang.org/docs/getting_started/noir_installation) with

1. Install [noirup](https://noir-lang.org/docs/getting_started/noir_installation):

   ```bash
   curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
   ```

2. Install Nargo:

   ```bash
   noirup
   ```

3. Install `bbup`, the tool for managing Barretenberg versions, by following the instructions
   [here](https://github.com/AztecProtocol/aztec-packages/blob/master/barretenberg/bbup/README.md#installation).

4. Then run `bbup`.

<br>

## Check Noir (Nargo) version

- Since the [PR #18](https://github.com/JBANKS040/OpenBands/pull/18), the Noir (Nargo) version must be `1.0.0-beta.4`.
```bash
noirup --version 1.0.0-beta.4
```

- Check whether the Noir (Nargo) version is properly updated or not:
```bash
nargo -V
.
.
.
nargo version = 1.0.0-beta.4
```
(More detail is [here](https://noir-lang.org/docs/getting_started/noir_installation#fetching-binaries))

<br>

## Set the environment file (`env`)

- Create the `env` file:
```bash
cp .env.example .env
```

<br>

## ZK circuit - Test

- Run the test of the ZK circuit (`./circuits/src/tests/mod.nr`) via the `./circuits/circuit_test.sh`:
```bash
cd circuits
sh circuit_test.sh
```

<br>

## ZK circuit - Generate an artifact of circuit and `vk` (Verification Key)

- Create the `Prover.toml` by copying the `Prover.example.toml`. Then, appropreate values should be stored into there.
```bash
cd circuits
cp Prover.example.toml Prover.toml
```
or
```bash
cd circuits
nargo check
```

- Run the ZK circuit (`./circuits/src/main.nr`) via the `./circuits/build.sh` to generate an artifact of circuit and `vk` (Verification Key):
```bash
cd circuits
sh build.sh
```

<br>

## Show the size of ZK circuit
```bash
cd circuits
sh info.sh
```
