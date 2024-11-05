const { ethers } = require("hardhat");


const FUNDED_ADDRESSES = [
  "0xeFeC29d4FfF7c0A14ad99990964161Eb1123E017",
  "0x159264e6a27E3722481914dbadb1510981d30Afa",
  "0xFd4c247400DA2D63710D289904fe82aeA203Bf8E",
  "0xF56BDd0C96A4C4056F2AF515Fe87964eA6Ef6213",
  "0x6a33287e08Aa3C88b4B725645aeD33742d357B38",
  "0x336374AeeE082bE99878815Fc72A23cC28F3C391",
  "0xc84Ad4dB0821b50726309a38f1bA7777c840412f",
  "0x356434b93720aC5Ce8Df68e691Ce27d1Cf06DCb0",
  "0x63A635C77F4f8a50959e5130BDdc08599329072a",
  "0x86541C378C38A255e68F170ee407E4A437d8a93b",
  "0xb156940fCaBd9ccEf7e276BFFE145dE4305C111a",
  "0x4c84FcabaC95B4cD71541201C264610f30F007d5",
  "0x74242a59b9FC5676eFb9a759f88781c31B63D2AF",
  "0x9625e71C5393CD11b367aFb9B6cD78f8E60BbE79",
  "0xd04609367a4730d266f079b3E0B9e682220B3231",
  "0x62e03Df68473a5c53Cf421De9Eb131fCb4b98D20",
  "0x7344727887023cC4632D7F291976F6cbc3Dad794",
  "0x8717Bc31d0D3959b3D3C94B187Fb6D540426302C",
  "0x63CeDF544Fda2C18b08C573a35cB8Df6B0Fca6A9"
];

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying ERC-20 token with account:", deployer.address);

  const MyToken = await ethers.getContractFactory("TestToken");
  const USDT = await MyToken.deploy(ethers.utils.parseUnits("10000000000", 6), 6, "Tether USD", "USDT");
  const DAI = await MyToken.deploy(ethers.utils.parseUnits("10000000000", 18), 18, "DAI", "DAI");
  const USDC = await MyToken.deploy(ethers.utils.parseUnits("10000000000", 6), 6, "USD Coin", "USDC");
  const WBTC = await MyToken.deploy(ethers.utils.parseUnits("10000000000", 8), 8, "Wrapped Bitcoin", "WBTC");
  const AAVE = await MyToken.deploy(ethers.utils.parseUnits("10000000000", 18), 18, "Aave", "AAVE");
  const UBALLET_TOKEN = await MyToken.deploy(ethers.utils.parseUnits("10000000000", 18), 18, "Uballet Token", "FIUBA");

  console.log("USDT deployed to:", USDT.address);
  console.log("DAI deployed to:", DAI.address);
  console.log("USDC deployed to:", USDC.address);
  console.log("WBTC deployed to:", WBTC.address);
  console.log("AAVE deployed to:", AAVE.address);
  console.log("UBALLET_TOKEN deployed to:", UBALLET_TOKEN.address);

  
  for (const address of FUNDED_ADDRESSES) {
    await USDT.transfer(address, ethers.utils.parseUnits("100", 6));
    await USDC.transfer(address, ethers.utils.parseUnits("100", 6));
    await DAI.transfer(address, ethers.utils.parseUnits("100", 18));
    await WBTC.transfer(address, ethers.utils.parseUnits("0.5", 8));
    await AAVE.transfer(address, ethers.utils.parseUnits("100", 18));
    await UBALLET_TOKEN.transfer(address, ethers.utils.parseUnits("100", 18));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
