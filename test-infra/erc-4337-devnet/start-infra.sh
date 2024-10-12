#!/bin/bash

docker compose up -d
./wait.sh
make fund-address ADDRESS=0x94f05c5aE1a892CDc887d38AF238DcDE21Bfd3BD ETH=100
cd ./modular-account && forge build && forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast