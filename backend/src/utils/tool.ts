import { ethers, Wallet } from "ethers";
import { ACCOUNT, BUYER, ContractAddress } from "../constant";
import * as arNFTJson from "../assets/ARNFT.json";
import * as marketJson from "../assets/ARNftMarket.json";

export const getRoles = () => {
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
  return {
    provider,
    signer,
    buyer,
  };
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
