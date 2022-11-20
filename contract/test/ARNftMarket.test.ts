require("chai");
const { ethers } = require("hardhat");
import * as jsonData from "../constants/ar.json";

const models = jsonData.models;

describe("test NFTMarket", function () {
  it("create NFT and put it into market", async () => {
    // NFT Market
    const nftMarket = await ethers.getContractFactory("ARNftMarket");
    const market = await nftMarket.deploy();
    await market.deployed();
    const marketAddress = market.address;
    // NFT
    const arNftContract = await ethers.getContractFactory("ARNFT");
    const nft = await arNftContract.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();
    // change price to ether
    const auctionPrice = ethers.utils.parseUnits("100", "ether");
    // create two NFTs
    await nft.createToken(JSON.stringify(models[0]));
    await nft.createToken(JSON.stringify(models[1]));
    // put two nft into market
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });
    /*
        在现实世界的中，用户将通过 Metamask 等数字钱包与合约进行交互。
        在测试环境中，将使用由 Hardhat 提供的本地地址进行交互
    */
    const [owner, buyerAddress] = await ethers.getSigners();
    // sale one nft to another user
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });
    // fetch those unsold NFTs
    let arrayItems = await market.fetchMarketItems();
    const mapFunc = async (i: any) => {
      console.log(i.tokenId);
      const tokenUri = await nft.tokenURI(i.tokenId);
      return {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
      };
    };

    arrayItems = await Promise.all(arrayItems.map(mapFunc));
    console.log("unsold NFTs", arrayItems);

    // fetchMyNFTs
    const myNFTs = await market.connect(buyerAddress).fetchMyNFTs();
    const myNFTItems = await Promise.all(
      myNFTs.filter((nft: any) => nft.tokenId.toNumber() > 0).map(mapFunc)
    );
    console.log("My NFT:", myNFTItems);
    // get all nfts
    const allCreatedNFTs = await market.connect(owner).fetchItemsCreated();
    const allCreatedNFTsItems = await Promise.all(
      allCreatedNFTs
        .filter((nft: any) => nft.tokenId.toNumber() > 0)
        .map(mapFunc)
    );
    console.log(allCreatedNFTsItems);
  });
});
