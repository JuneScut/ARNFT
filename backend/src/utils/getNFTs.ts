import { ethers } from "ethers";
import { getMarketContract, getNFTContract, getRoles } from "./tool";

const getNFTs = async () => {
  const { provider, signer, buyer } = getRoles();

  const marketContract = getMarketContract(buyer);
  const nftContract = getNFTContract(buyer);
  const creatorNFTContract = getNFTContract(signer);

  let listingPrice = await marketContract.getListingPrice();
  listingPrice = listingPrice.toString();
  const auctionPrice = ethers.utils.parseUnits("1", "ether");

  let count = await creatorNFTContract.balanceOf(signer.address);
  console.log(`creator, count=${count}`);

  // TODO: try catch, fund is insufficient
  const tx = await marketContract
    .connect(buyer)
    .createMarketSale(nftContract.address, count, {
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
