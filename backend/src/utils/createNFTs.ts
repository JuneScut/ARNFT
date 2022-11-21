import { ethers } from "ethers";
import * as modelJson from "../assets/ar.json";
import { getMarketContract, getNFTContract, getRoles } from "./tool";

const createNFTs = async () => {
  const { signer } = getRoles();
  // market
  const marketContract = getMarketContract(signer);
  // nft
  const nftContract = getNFTContract(signer);
  let listingPrice = await marketContract.getListingPrice();
  listingPrice = listingPrice.toString();
  const auctionPrice = ethers.utils.parseUnits("100", "ether");
  const models = modelJson.models;
  // create NFTs, from: signer.address --> NFTContract.address
  await nftContract.connect(signer).createToken(JSON.stringify(models[0]));

  // 获取某地址当前拥有的该 NFT 数量
  let count = await nftContract.balanceOf(signer.address);
  console.log(`creator, count=${count}`);

  let tokenOwner = await nftContract.ownerOf(count);
  console.log("tokenOwner=", tokenOwner);

  // 传入 tokenId, 获取对应链上存储的元数据
  let data = await nftContract.tokenURI(count);
  console.log(data);

  // TODO: put them into market
  const tx = await marketContract.createMarketItem(
    nftContract.address,
    count,
    auctionPrice,
    {
      value: listingPrice,
      gasLimit: 3e4, // fix gas estimation
    }
  );
  console.log("createMarketItem,", tx);

  // fetch those unsold NFTs
  let arrayItems = await marketContract.fetchMarketItems();
  console.log("arrayItems", arrayItems);
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
