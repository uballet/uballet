require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    docker: {
      url: "http://localhost:8545", // URL to the Docker testnet
      chainId: 1337,                // Must match the Docker testnet chainId
      accounts: ["0x4ac9196bcee46282a0e88f97eb998f5b6f8d6236c36343e04874c74da019b79f"]
    },
  },
  solidity: "0.8.22",
};
