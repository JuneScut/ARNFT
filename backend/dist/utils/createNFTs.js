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
const modelJson = __importStar(require("../assets/ar.json"));
const tool_1 = require("./tool");
const createNFTs = () => __awaiter(void 0, void 0, void 0, function* () {
    const { signer } = (0, tool_1.getRoles)();
    // market
    const marketContract = (0, tool_1.getMarketContract)(signer);
    // nft
    const nftContract = (0, tool_1.getNFTContract)(signer);
    let listingPrice = yield marketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    const auctionPrice = ethers_1.ethers.utils.parseUnits("100", "ether");
    const models = modelJson.models;
    // create NFTs, from: signer.address --> NFTContract.address
    yield nftContract.connect(signer).createToken(JSON.stringify(models[0]));
    // 获取某地址当前拥有的该 NFT 数量
    let count = yield nftContract.balanceOf(signer.address);
    console.log(`creator, count=${count}`);
    let tokenOwner = yield nftContract.ownerOf(count);
    console.log("tokenOwner=", tokenOwner);
    // 传入 tokenId, 获取对应链上存储的元数据
    let data = yield nftContract.tokenURI(count);
    console.log(data);
    console.log("listingPrice=", listingPrice);
    // TODO: put them into market
    const tx = yield marketContract.createMarketItem(nftContract.address, count, auctionPrice, {
        value: listingPrice,
        gasLimit: 3e4, // fix gas estimation
    });
    console.log("createMarketItem,", tx);
    yield tx.wait();
    // fetch those unsold NFTs
    let arrayItems = yield marketContract.fetchMarketItems();
    console.log("arrayItems", arrayItems);
    const mapFunc = (i) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(i.tokenId);
        const tokenUri = yield nftContract.tokenURI(i.tokenId);
        return {
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            tokenUri,
        };
    });
    arrayItems = yield Promise.all(arrayItems.map(mapFunc));
    console.log("unsold NFTs", arrayItems);
});
exports.default = createNFTs;
