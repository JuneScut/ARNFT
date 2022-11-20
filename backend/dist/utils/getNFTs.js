"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const constant_1 = require("../constant");
const arNFTJson = __importStar(require("../assets/ARNFT.json"));
const marketJson = __importStar(require("../assets/ARNftMarket.json"));
const getNFTs = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider("https://rpc.debugchain.net");
    const signer = new ethers_1.ethers.Wallet(constant_1.ACCOUNT.PK, provider);
    const buyer = new ethers_1.ethers.Wallet(constant_1.BUYER.PK, provider);
    const marketAbi = marketJson.abi;
    const marketContract = new ethers_1.ethers.Contract(constant_1.ContractAddress.Market, marketAbi, signer);
    const nftAbi = arNFTJson.abi;
    const nftContract = new ethers_1.ethers.Contract(constant_1.ContractAddress.ARNFT, nftAbi, signer);
    let listingPrice = yield marketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    const auctionPrice = ethers_1.ethers.utils.parseUnits("100", "ether");
    // TODO: try catch, fund is insufficient
    const tx = yield marketContract
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
});
exports.default = getNFTs;
