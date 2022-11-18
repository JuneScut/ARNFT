import { ethers } from "ethers";
import { ACCOUNT, ContractAddress, CREATOR } from "../constant";
import * as arNFTJson from "../assets/ARNFT.json";
import * as marketJson from "../assets/ARNftMarket.json";
import * as modelJson from "../assets/ar.json";

const createNFTs = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.debugchain.net"
  );
  const signer = new ethers.Wallet(ACCOUNT.PK, provider);
  // market
  const marketAbi = marketJson.abi;
  const marketContract = new ethers.Contract(
    ContractAddress.Market,
    marketAbi,
    signer
  );
  const marketAddress = marketContract.address;
  // nft
  const nftAbi = arNFTJson.abi;
  const nftContract = new ethers.Contract(
    ContractAddress.ARNFT,
    nftAbi,
    signer
  );
  let listingPrice = await marketContract.getListingPrice();
  listingPrice = listingPrice.toString();
  const auctionPrice = ethers.utils.parseUnits("100", "ether");
  const models = modelJson.models;
  // create NFTs
  await nftContract.connect(signer).createToken(JSON.stringify(models[0]));
  await nftContract.connect(signer).createToken(JSON.stringify(models[1]));
  // put them into market
  await marketContract.createMarketItem(nftContract.address, 1, auctionPrice, {
    value: listingPrice,
  });
  await marketContract.createMarketItem(nftContract.address, 2, auctionPrice, {
    value: listingPrice,
  });
  // fetch those unsold NFTs
  let arrayItems = await marketContract.fetchMarketItems();
  const mapFunc = async (i: any) => {
    console.log(i.tokenId);
    const tokenUri = await nftContract.tokenURI(i.tokenId);
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
};

export default createNFTs;
