"use strict";
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
const tool_1 = require("./tool");
const getNFTs = () => __awaiter(void 0, void 0, void 0, function* () {
    const { provider, signer, buyer } = (0, tool_1.getRoles)();
    const marketContract = (0, tool_1.getMarketContract)(buyer);
    const nftContract = (0, tool_1.getNFTContract)(buyer);
    const creatorNFTContract = (0, tool_1.getNFTContract)(signer);
    let listingPrice = yield marketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    const auctionPrice = ethers_1.ethers.utils.parseUnits("1", "ether");
    let count = yield creatorNFTContract.balanceOf(signer.address);
    console.log(`creator, count=${count}`);
    // TODO: try catch, fund is insufficient
    const tx = yield marketContract
        .connect(buyer)
        .createMarketSale(nftContract.address, count, {
        value: auctionPrice,
        gasLimit: 3e4,
    });
    console.log(tx);
    const myNFTs = yield marketContract.connect(buyer).fetchMyNFTs();
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
    const myNFTItems = yield Promise.all(myNFTs.filter((nft) => nft.tokenId.toNumber() > 0).map(mapFunc));
    console.log("My NFT:", myNFTItems);
});
exports.default = getNFTs;
