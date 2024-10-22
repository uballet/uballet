!/bin/bash

original_dir=$(pwd)

cd erc-4337-devnet
./start-infra.sh

cd "$original_dir"
cd erc20
npm install
npx hardhat compile
npx hardhat run --network docker scripts/deploy-erc20.js