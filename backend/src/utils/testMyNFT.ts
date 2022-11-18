import { ethers } from "ethers";
import { ACCOUNT, ContractAddress, CREATOR } from "../constant";
import * as marketJson from "../assets/MyNFT.json";
import * as modelJson from "../assets/ar.json";

const testMyNFT = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.debugchain.net"
  );
  const signer = new ethers.Wallet(ACCOUNT.PK, provider);
  const myNFTabi = marketJson.abi;
  const contract = new ethers.Contract(ContractAddress.MyNFT, myNFTabi, signer);
  const models = modelJson.models;

  //   let tx = await contract.connect(signer).awardItem(JSON.stringify(models[0]));
  //   await tx.wait();
  const supplys = await contract.totalSupply();
  console.log(`supplys=${supplys}`);
  for (let i = 0; i < supplys.toNumber(); i++) {
    const tokenId = await contract.tokenByIndex(i);
    const data = await contract.tokenURI(tokenId);
    console.log("index=" + i + ";tokenId=" + tokenId + ";data=" + data);
  }
};

export default testMyNFT;
