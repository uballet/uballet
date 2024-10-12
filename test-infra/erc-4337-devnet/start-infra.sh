#!/bin/bash

docker compose up -d
./wait.sh
make fund-address ADDRESS=0x94f05c5aE1a892CDc887d38AF238DcDE21Bfd3BD ETH=100
cd ./multisig-plugin/lib/modular-account && forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
cd ../../ && forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast