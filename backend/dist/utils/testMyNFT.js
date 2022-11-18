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
const marketJson = __importStar(require("../assets/MyNFT.json"));
const modelJson = __importStar(require("../assets/ar.json"));
const testMyNFT = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider("https://rpc.debugchain.net");
    const signer = new ethers_1.ethers.Wallet(constant_1.ACCOUNT.PK, provider);
    const myNFTabi = marketJson.abi;
    const contract = new ethers_1.ethers.Contract(constant_1.ContractAddress.MyNFT, myNFTabi, signer);
    const models = modelJson.models;
    //   let tx = await contract.connect(signer).awardItem(JSON.stringify(models[0]));
    //   await tx.wait();
    const supplys = yield contract.totalSupply();
    console.log(`supplys=${supplys}`);
    for (let i = 0; i < supplys.toNumber(); i++) {
        const tokenId = yield contract.tokenByIndex(i);
        const data = yield contract.tokenURI(tokenId);
        console.log("index=" + i + ";tokenId=" + tokenId + ";data=" + data);
    }
});
exports.default = testMyNFT;
