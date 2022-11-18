import { Contract, ethers } from "ethers";
import { Context } from "koa";
import { ACCOUNT, ContractAddress } from "../constant";
import createNFTs from "../utils/createNFTs";
import testMyNFT from "../utils/testMyNFT";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.debugchain.net"
);

export default {
  getBalance: async (ctx: Context): Promise<void> => {
    const balance = await provider.getBalance(ACCOUNT.ADDRESS);
    ctx.body = `balance=${ethers.utils.formatEther(balance)}`;
  },
  test: async (ctx: Context) => {
    createNFTs();
    // testMyNFT();
    ctx.body = "test";
  },
};
