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
const modelJson = __importStar(require("../assets/ar.json"));
const createNFTs = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider("https://rpc.debugchain.net");
    const signer = new ethers_1.ethers.Wallet(constant_1.ACCOUNT.PK, provider);
    // market
    const marketAbi = marketJson.abi;
    const marketContract = new ethers_1.ethers.Contract(constant_1.ContractAddress.Market, marketAbi, signer);
    const marketAddress = marketContract.address;
    // nft
    const nftAbi = arNFTJson.abi;
    const nftContract = new ethers_1.ethers.Contract(constant_1.ContractAddress.ARNFT, nftAbi, signer);
    let listingPrice = yield marketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    const auctionPrice = ethers_1.ethers.utils.parseUnits("100", "ether");
    const models = modelJson.models;
    // create NFTs
    yield nftContract.connect(signer).createToken(JSON.stringify(models[0]));
    yield nftContract.connect(signer).createToken(JSON.stringify(models[1]));
    // put them into market
    yield marketContract.createMarketItem(nftContract.address, 1, auctionPrice, {
        value: listingPrice,
    });
    yield marketContract.createMarketItem(nftContract.address, 2, auctionPrice, {
        value: listingPrice,
    });
    // fetch those unsold NFTs
    let arrayItems = yield marketContract.fetchMarketItems();
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
