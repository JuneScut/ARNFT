import { ethers, Wallet } from "ethers";
import { ContractAddress } from "../utils/constant";
import * as arNFTJson from "../../assets/ARNFT.json";
import * as marketJson from "../../assets/ARNftMarket.json";
import * as admin from "firebase-admin";

let network = {
  chainId: 8348,
  name: "Etherdata",
};

export const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.debugchain.net",
  network
);

export const getCreator = async () => {
  const db = admin.firestore();
  const creator = await db.collection("/users").doc("creator").get();
  const data = creator.data();
  if (!data) {
    throw Error("No Creator!");
  } else {
    const pk = data.pk;
    // const address = data.address;
    const creator = new ethers.Wallet(pk, provider);
    return creator;
  }
};

export const getBuyer = async () => {
  const db = admin.firestore();
  const creator = await db.collection("/users").doc("buyer").get();
  const data = creator.data();
  if (!data) {
    throw Error("No Buyer!");
  } else {
    const pk = data.pk;
    // const address = data.address;
    const creator = new ethers.Wallet(pk, provider);
    return creator;
  }
};

export const getMarketContract = (signer: Wallet) => {
  // market
  const marketAbi = marketJson.abi;
  const marketContract = new ethers.Contract(
    ContractAddress.Market,
    marketAbi,
    signer
  );
  return marketContract;
};

export const getNFTContract = (signer: Wallet) => {
  // nft
  const nftAbi = arNFTJson.abi;
  const nftContract = new ethers.Contract(
    ContractAddress.ARNFT,
    nftAbi,
    signer
  );
  return nftContract;
};

export const getAllNFTs = async () => {
  const creator = await getCreator();
  const nftContract = getNFTContract(creator);
  const marketContract = getMarketContract(creator);
  console.log(creator.address);
  console.log(nftContract.address);
  console.log(marketContract.address);
  let arrayItems = await marketContract.fetchItemsCreated();
  console.log("4", arrayItems);
  const nfts = await Promise.all(
    arrayItems.map(async (i: any, idx: number) => {
      const tokenUri = await nftContract.tokenURI(i.tokenId);
      return {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri,
        sold: i.sold,
        nftId: idx + 1,
      };
    })
  );
  return nfts;
};
