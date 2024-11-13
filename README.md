# uballet

![Badge for react native unit tests](https://github.com/MarkoVrljicak/uballet/actions/workflows/unit-test.yml/badge.svg)

ERC-4337 compliant mobile wallet for Ethereum-based blockchains

## Backend

Backend infraestructure is deployed on top of NextJS framework. In order to deploy backend in local machine, follow this steps:

1. Run `npm i` command
2. Run `docker-compose up` command
3. Complete .env file. Use env.example as template
4. Run `npm start` command
5. Run `npm run typeorm migration:run -- -d src/data-source.ts command`

### Common issues

To address the common 'Not found entity' error when running migration, follow this steps:

1. Replace in data-source.ts

```
const entities = path.join(**dirname, "../dist/entity/\*.js");
const migrations = path.join(**dirname, "../dist/migration/\*.js");
```

with

```
const entities = path.join(**dirname, "./entity/\*.ts");
const migrations = path.join(**dirname, "./migration/\*.ts");
```

2. Then replace in package.json `"typeorm": "rm -rf ./dist && typeorm-ts-node-commonjs"` with `"typeorm": "typeorm-ts-node-commonjs"`
3. Then run, if not already did `npm run typeorm migration:run -- -d src/data-source.ts`

## Frontend

Wallet frontend is written in Typescript code, supported by Expo development framework. In order to deploy local mode application, follow this steps after cloning git repository:

### Windows and Android

First install system dependencies:

1. Install NodeJS
2. Install Android Studio, the create virtual device. From Android Studio > Tool > Device manager > Create virtual device > Choose an emulator with an API 34 (Android 14) image

After installed dependencies, install project dependencies and run:

1. Run `npm i`
2. Complete .env file. Use env.example as template
3. Run `npx expo start`
4. Run `npm run build:android:simulator` to generate build
5. Or if build already generated, run `npm run run:android`

### MacOS and iOS

1. Complete


### E2E TESTING

#### Start back-end

You need to run the backend setting up the env variable `IS_E2E_TESTING = 1`. This will connect the back-end to the testing db.

#### Start metro

You need to start the metro server setting the env variable `IS_E2E_TESTING = 1`. This will run the metro bundler using the
e2e testing config, with specific addresses for the account factories living in the test infra.

#### Test infra

You need to go to the `/test-infra` directory and run the `./start-infra.sh` script. You need to keep an eye while doing this and make sure the scripts finishes its execution. If the execution seems to stall indefinitely waiting for tx receipts in the factory deploy process, you might need to stop the process, take down the docker-container for `erc-4337-devnet` and run the script again.

The required `.env` variables are present in the `.env.local` files under each submodule. You'll need to copy these values into a `.env` file next to each `.env.local` file.

After running the script, the multisig plugin should be deployed at `0xD1D8C2c0fd66DfA792Fa2A70296690dBf77cc8f4`, and the multisig account factory should be deployed at `0x42FfC8c171D7F62b231633E9d06f11a83aA6E09e`. You can see these results in the logs of the terminal you run the script with. If the resulting addresses are different, it means that something went wrong or you don't have the correct env variables, and you won't be able to run the e2e tests since it requires the deployments at the specified addresses.

The script will also deploy erc20 like contracts at following addresses. You can also check the deployed addresses in the logs and should match the ones below.

```
USDT deployed to: 0xEC269cB9fA9bE1BDDBA386b6cA7c85c43E9815bf
DAI deployed to: 0x9FEAa3710a0456740c59EcAB5db628b923903FF9
USDC deployed to: 0x3Bca8F567E934fd3a2D0C7237EC8196612ab67cc
WBTC deployed to: 0x37CBB2C4C1E8359f0b45bdbBe72bF6e8704b97EE
AAVE deployed to: 0x689A308F09148039F5c6122dbCc1DF1EdD2Ccbb9
UBALLET_TOKEN deployed to: 0xDECeBb93a3f41199eb2F8e4DD7520dF8Fb13773b
```

#### Running the tests

Once you've completed the steps above. You can go to the `/frontend` directory and run `maestro test <flow>` to run a specific flow.