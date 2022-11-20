import { ethers } from "ethers";
import { ACCOUNT, ContractAddress } from "../constant";
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
  console.log("marketAddress=", marketAddress);
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
  // create NFTs, from: signer.address --> NFTContract.address
  await nftContract.connect(signer).createToken(JSON.stringify(models[0]));

  // 这个函数可以获取某地址当前拥有的该 NFT 数量
  let balance = await nftContract.balanceOf(signer.address);
  console.log(`balance=${balance}`);

  let tokenOwner = await nftContract.ownerOf(1);
  console.log("tokenOwner=", tokenOwner);

  // 传入 tokenId, 获取对应链上存储的元数据
  let data = await nftContract.tokenURI(1);
  console.log(data);

  // TODO: put them into market
  const tx = await marketContract.createMarketItem(
    nftContract.address,
    1,
    auctionPrice,
    {
      value: listingPrice,
      gasLimit: 3e4, // fix gas estimation
    }
  );
  console.log("createMarketItem,", tx);

  // fetch those unsold NFTs
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

export default createNFTs;
