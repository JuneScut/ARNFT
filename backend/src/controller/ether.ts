import { Contract, ethers } from "ethers";
import { Context } from "koa";
import { ACCOUNT, ContractAddress } from "../constant";
import * as jsonData from "../assets/ARNFT.json";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.debugchain.net"
);

// 获取已mint tokenURI
export const getTokenURIs = async (contract: Contract) => {
  const totalSupply = await contract.totalSupply();
  console.log("totalSupplyToken is" + totalSupply);
  const list = [];
  for (let tokenID = 0; tokenID < totalSupply; tokenID++) {
    const tokenURI = await contract.tokenURI(tokenID);
    list.push(tokenURI);
  }
  return list;
};

export default {
  getBalance: async (ctx: Context): Promise<void> => {
    const balance = await provider.getBalance(ACCOUNT.ADDRESS);
    ctx.body = `balance=${ethers.utils.formatEther(balance)}`;
  },
  mint: async (ctx: Context) => {
    const signer = new ethers.Wallet(ACCOUNT.PK, provider);
    // const jsonData = JSON.parse(fs.readFileSync("ARNFT.json", "utf-8"));
    const abi = jsonData.abi;
    // create contract instance
    console.log(111);
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    console.log(222, contract);
    // mint a new NFT
    const tx = await contract.awardItem(
      ACCOUNT.ADDRESS,
      "https://developer.apple.com/augmented-reality/quick-look/models/nike-pegasus/nike-pegasus_2x.png"
    );
    console.log(3333, tx);
    await tx.wait();
    console.log(444, tx);
    const list = await getTokenURIs(contract);
    console.log(555, JSON.stringify(list));
    ctx.body = `mint successfully, tokenUrl=${JSON.stringify(list)}`;
  },
};
