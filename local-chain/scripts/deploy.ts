import { ethers } from "hardhat";

async function main() {
  const tokenName = "SKToken";
  const symbol = "PKR";
  const decimals = 2;

  const DefiBank = await ethers.getContractFactory("DefiBank");
  const defiBank = await DefiBank.deploy(tokenName, symbol, decimals);

  await defiBank.deployed();

  console.log("DefiBank deployed to:", defiBank.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
