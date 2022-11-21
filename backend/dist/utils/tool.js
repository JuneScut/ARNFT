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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNFTContract = exports.getMarketContract = exports.getRoles = void 0;
const ethers_1 = require("ethers");
const constant_1 = require("../constant");
const arNFTJson = __importStar(require("../assets/ARNFT.json"));
const marketJson = __importStar(require("../assets/ARNftMarket.json"));
const getRoles = () => {
    let network = {
        chainId: 8348,
        name: "Etherdata",
    };
    const provider = new ethers_1.ethers.providers.JsonRpcProvider("https://rpc.debugchain.net", network);
    const signer = new ethers_1.ethers.Wallet(constant_1.ACCOUNT.PK, provider);
    const buyer = new ethers_1.ethers.Wallet(constant_1.BUYER.PK, provider);
    return {
        provider,
        signer,
        buyer,
    };
};
exports.getRoles = getRoles;
const getMarketContract = (signer) => {
    // market
    const marketAbi = marketJson.abi;
    const marketContract = new ethers_1.ethers.Contract(constant_1.ContractAddress.Market, marketAbi, signer);
    return marketContract;
};
exports.getMarketContract = getMarketContract;
const getNFTContract = (signer) => {
    // nft
    const nftAbi = arNFTJson.abi;
    const nftContract = new ethers_1.ethers.Contract(constant_1.ContractAddress.ARNFT, nftAbi, signer);
    return nftContract;
};
exports.getNFTContract = getNFTContract;
