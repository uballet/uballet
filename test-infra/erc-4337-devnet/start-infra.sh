#!/bin/bash

docker compose up -d
./wait.sh

# Fund addresses used in e2e testing
make fund-address ADDRESS=0x159264e6a27E3722481914dbadb1510981d30Afa ETH=100
make fund-address ADDRESS=0xeFeC29d4FfF7c0A14ad99990964161Eb1123E017 ETH=100
make fund-address ADDRESS=0xFd4c247400DA2D63710D289904fe82aeA203Bf8E ETH=100
make fund-address ADDRESS=0xF56BDd0C96A4C4056F2AF515Fe87964eA6Ef6213 ETH=100
make fund-address ADDRESS=0x6a33287e08Aa3C88b4B725645aeD33742d357B38 ETH=100
make fund-address ADDRESS=0x336374AeeE082bE99878815Fc72A23cC28F3C391 ETH=100
make fund-address ADDRESS=0xc84Ad4dB0821b50726309a38f1bA7777c840412f ETH=100
make fund-address ADDRESS=0x356434b93720aC5Ce8Df68e691Ce27d1Cf06DCb0 ETH=100
make fund-address ADDRESS=0x63A635C77F4f8a50959e5130BDdc08599329072a ETH=100
make fund-address ADDRESS=0x86541C378C38A255e68F170ee407E4A437d8a93b ETH=100
make fund-address ADDRESS=0xb156940fCaBd9ccEf7e276BFFE145dE4305C111a ETH=100
make fund-address ADDRESS=0x4c84FcabaC95B4cD71541201C264610f30F007d5 ETH=100
make fund-address ADDRESS=0x74242a59b9FC5676eFb9a759f88781c31B63D2AF ETH=100
make fund-address ADDRESS=0x9625e71C5393CD11b367aFb9B6cD78f8E60BbE79 ETH=100
make fund-address ADDRESS=0xd04609367a4730d266f079b3E0B9e682220B3231 ETH=100
make fund-address ADDRESS=0x62e03Df68473a5c53Cf421De9Eb131fCb4b98D20 ETH=100
make fund-address ADDRESS=0x7344727887023cC4632D7F291976F6cbc3Dad794 ETH=100
make fund-address ADDRESS=0x8717Bc31d0D3959b3D3C94B187Fb6D540426302C ETH=100
make fund-address ADDRESS=0x63CeDF544Fda2C18b08C573a35cB8Df6B0Fca6A9 ETH=100
make fund-address ADDRESS=0x94f05c5aE1a892CDc887d38AF238DcDE21Bfd3BD ETH=1000
make fund-address ADDRESS=0x50d4e430c1c9617b5575c01ae7bc9b17ea5d462c ETH=100
make fund-address ADDRESS=0xcd6abd98791a51b11b40b46b789e5d0dccf0bc58 ETH=100
make fund-address ADDRESS=0x13d732d4b7c3d9e97f30ee185b048c0afbeb86a3 ETH=100
make fund-address ADDRESS=0x9ec200ce52e7d6217c652fc550fac4800b2c5de2 ETH=100
make fund-address ADDRESS=0x08bc2ce4d20fd7d7414bfc3cabd2f5fd58982f45 ETH=100
make fund-address ADDRESS=0x212b8620859c662dbb6d75c1a93cb4fdccbf5dc8 ETH=100
make fund-address ADDRESS=0x51cd85f9a9cd2de8f8dbefc40fe1a50709fa7b71 ETH=100
make fund-address ADDRESS=0x98a784735b0fb19193ee3ffc5be9c5a83d1c7bbe ETH=100
make fund-address ADDRESS=0xbf8eacf1238987902066fbfade774a9627ae41c9 ETH=100
make fund-address ADDRESS=0xc8286643e1cfb22b11c0c75174d143f66e04a2cd ETH=100
make fund-address ADDRESS=0x888ae77faecb7a1e18b91a69d0f36f686a8e8953 ETH=100
make fund-address ADDRESS=0x45915f793802e029e78faac4ab88ba5eac3ac8d7 ETH=100
make fund-address ADDRESS=0xc54ea2fde46a9dd4cf3a849c88ce62f8d8635205 ETH=100
make fund-address ADDRESS=0xfa69a2c66b447c0ec7fd820fc37d0811ee2a1ad0 ETH=100
make fund-address ADDRESS=0xb9d6a67ac3df25e4e935507cfa7b88106db04ec1 ETH=100
make fund-address ADDRESS=0x528e896ebc5c4c2394fd0562983c4c830341ffea ETH=100
make fund-address ADDRESS=0x93aa0c9df365bba5192d520c28e247873b417b5e ETH=100
make fund-address ADDRESS=0x212a6c0aa4d5664b993e22ec6da9c820b42effc6 ETH=100
make fund-address ADDRESS=0xd13954255b6714a480cc76f52a680e0467a2f3d4 ETH=100
make fund-address ADDRESS=0x9a1092a2ca8c3967b22d583a8eb0d470ab845ed4 ETH=100
make fund-address ADDRESS=0x187730cc59d3154bdb4b0a107366c7333fb9ad7c ETH=100
make fund-address ADDRESS=0x3380892c00bc98f599eebff1f2e7c4bcdacae910 ETH=100
make fund-address ADDRESS=0x8382afbb5dcca154efc7e038047cb5fd79d5ae5d ETH=100
make fund-address ADDRESS=0x9160000a8b7c6e7948e68b897eea16eeb85ddefe ETH=100
make fund-address ADDRESS=0xc61fb50e191e3698d18302249f3df10022492ebe ETH=100
make fund-address ADDRESS=0x35be1b563a19879f67242d4fc13e1f39bcc13673 ETH=100
make fund-address ADDRESS=0x396d538d47afe228f00616dd1f07d08f4064218d ETH=100
make fund-address ADDRESS=0x8641991a016cdd6c97959afe73a33da7097d3328 ETH=100
make fund-address ADDRESS=0xee5c9fe08ea04a868d0162c26f821c3885af6f88 ETH=100
make fund-address ADDRESS=0x4fb51e6761c0f48607f20479660ac87318f0bc83 ETH=100
make fund-address ADDRESS=0x5ba208094976219a90dc7759f6cb2fb084ee82c3 ETH=100
make fund-address ADDRESS=0x62eba71153674f0291d9e7f5ac2f45f66ef69c70 ETH=100
make fund-address ADDRESS=0xecdc25d3a989972910cee921e000e25a76dfa7b7 ETH=100
make fund-address ADDRESS=0x49c967ddd075ca3fadc33fe0f96d177dc400cfba ETH=100
make fund-address ADDRESS=0xb22269e0089e16a805b0f015e93ad84e3f3292a4 ETH=100
make fund-address ADDRESS=0x8723f05783bbf444d0c27c235b98de112eda25d7 ETH=100

# Deploy multisig account contracts
cd ./multisig-plugin/lib/modular-account
forge script script/deploy-01.s.sol --rpc-url http://localhost:8545 --broadcast
forge script script/deploy-02.s.sol --rpc-url http://localhost:8545 --broadcast
forge script script/deploy-03.s.sol --rpc-url http://localhost:8545 --broadcast
forge script script/deploy-04.s.sol --rpc-url http://localhost:8545 --broadcast


cd ../../

forge script script/deploy-01.s.sol --rpc-url http://localhost:8545 --broadcast
forge script script/deploy-02.s.sol --rpc-url http://localhost:8545 --broadcast
forge script script/deploy-03.s.sol --rpc-url http://localhost:8545 --broadcast
