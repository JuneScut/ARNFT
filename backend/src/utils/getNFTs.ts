import { ethers } from "ethers";
import { ACCOUNT, BUYER, ContractAddress } from "../constant";
import * as arNFTJson from "../assets/ARNFT.json";
import * as marketJson from "../assets/ARNftMarket.json";

const getNFTs = async () => {
  let network = {
    chainId: 8348,
    name: "Etherdata",
  };
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.debugchain.net",
    network
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
  const auctionPrice = ethers.utils.parseUnits("1", "ether");

  const balance = await provider.getBalance(buyer.address);
  console.log("balance:", ethers.utils.formatEther(balance));

  // TODO: try catch, fund is insufficient
  const tx = await marketContract
    .connect(buyer)
    .createMarketSale(nftContract.address, 1, {
      value: auctionPrice,
      gasLimit: 3e4,
    });
  console.log(tx);

  const myNFTs = await marketContract.connect(buyer).fetchMyNFTs();
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
  const myNFTItems = await Promise.all(
    myNFTs.filter((nft: any) => nft.tokenId.toNumber() > 0).map(mapFunc)
  );
  console.log("My NFT:", myNFTItems);
};
export default getNFTs;
