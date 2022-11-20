import { ethers } from "ethers";
import { ACCOUNT, BUYER, ContractAddress } from "../constant";
import * as arNFTJson from "../assets/ARNFT.json";
import * as marketJson from "../assets/ARNftMarket.json";

const getNFTs = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.debugchain.net"
  );
  const signer = new ethers.Wallet(ACCOUNT.PK, provider);
  const buyer = new ethers.Wallet(BUYER.PK, provider);

  const marketAbi = marketJson.abi;
  const marketContract = new ethers.Contract(
    ContractAddress.Market,
    marketAbi,
    signer
  );
  const nftAbi = arNFTJson.abi;
  const nftContract = new ethers.Contract(
    ContractAddress.ARNFT,
    nftAbi,
    signer
  );
  let listingPrice = await marketContract.getListingPrice();
  listingPrice = listingPrice.toString();
  const auctionPrice = ethers.utils.parseUnits("100", "ether");

  // TODO: try catch, fund is insufficient
  const tx = await marketContract
    .connect(buyer)
    .createMarketSale(nftContract.address, 1, {
      value: auctionPrice,
      gasLimit: 3e4,
    });
  console.log(tx);

  // const myNFTs = await marketContract.connect(buyer).fetchMyNFTs();
  // const myNFTItems = await Promise.all(
  //   myNFTs.filter((nft: any) => nft.tokenId.toNumber() > 0).map(mapFunc)
  // );
  // console.log("My NFT:", myNFTs);
  // let arrayItems = await marketContract.fetchSomething();
  // console.log("arrayItems", arrayItems);
  // const mapFunc = async (i: any) => {
  //   console.log(i.tokenId);
  //   const tokenUri = await nftContract.tokenURI(i.tokenId);
  //   return {
  //     price: i.price.toString(),
  //     tokenId: i.tokenId.toString(),
  //     seller: i.seller,
  //     owner: i.owner,
  //     tokenUri,
  //   };
  // };
  // arrayItems = await Promise.all(arrayItems.map(mapFunc));
  // console.log("unsold NFTs", arrayItems);
};
export default getNFTs;
