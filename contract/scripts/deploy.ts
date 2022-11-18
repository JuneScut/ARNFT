import { ethers } from "hardhat";

async function main() {
  const MyNFTContract = await ethers.getContractFactory("MyNFT");
  const contract = await MyNFTContract.deploy();

  await contract.deployed();
  console.log("MyNFT Contract deployed to:", contract.address);

  const nftMarket = await ethers.getContractFactory("ARNftMarket");
  const market = await nftMarket.deploy();

  await market.deployed();
  console.log("ARNftMarket Contract deployed to:", market.address);

  const marketAddress = market.address;
  const arNftContract = await ethers.getContractFactory("ARNFT");
  const nft = await arNftContract.deploy(marketAddress);
  await nft.deployed();
  console.log("nft Contract deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
