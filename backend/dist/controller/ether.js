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
exports.getTokenURIs = void 0;
const ethers_1 = require("ethers");
const constant_1 = require("../constant");
const jsonData = __importStar(require("../assets/ARNFT.json"));
const provider = new ethers_1.ethers.providers.JsonRpcProvider("https://rpc.debugchain.net");
// 获取已mint tokenURI
const getTokenURIs = (contract) => __awaiter(void 0, void 0, void 0, function* () {
    const totalSupply = yield contract.totalSupply();
    console.log("totalSupplyToken is" + totalSupply);
    const list = [];
    for (let tokenID = 0; tokenID < totalSupply; tokenID++) {
        const tokenURI = yield contract.tokenURI(tokenID);
        list.push(tokenURI);
    }
    return list;
});
exports.getTokenURIs = getTokenURIs;
exports.default = {
    getBalance: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const balance = yield provider.getBalance(constant_1.ACCOUNT.ADDRESS);
        ctx.body = `balance=${ethers_1.ethers.utils.formatEther(balance)}`;
    }),
    mint: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const signer = new ethers_1.ethers.Wallet(constant_1.ACCOUNT.PK, provider);
        // const jsonData = JSON.parse(fs.readFileSync("ARNFT.json", "utf-8"));
        const abi = jsonData.abi;
        // create contract instance
        console.log(111);
        const contract = new ethers_1.ethers.Contract(constant_1.ContractAddress, abi, signer);
        console.log(222, contract);
        // mint a new NFT
        const tx = yield contract.awardItem(constant_1.ACCOUNT.ADDRESS, "https://developer.apple.com/augmented-reality/quick-look/models/nike-pegasus/nike-pegasus_2x.png");
        console.log(3333, tx);
        yield tx.wait();
        console.log(444, tx);
        const list = yield (0, exports.getTokenURIs)(contract);
        console.log(555, JSON.stringify(list));
        ctx.body = `mint successfully, tokenUrl=${JSON.stringify(list)}`;
    }),
};
