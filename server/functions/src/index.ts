import { BigNumber, ethers } from "ethers";
import * as functions from "firebase-functions";
import { RETURN_CODE } from "./utils/constant";
import {
  getMarketContract,
  getNFTContract,
  getAllNFTs,
  getCreator,
  provider,
  getBuyer,
} from "./utils/tool";
import * as cross from "cors";
import * as admin from "firebase-admin";

const cors = cross({ origin: true });
admin.initializeApp(functions.config().firebase);

export const helloWorld = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    const creator = await getCreator();
    console.log(creator.address);
    response.send("Hello from Firebase, ellilachen!" + creator.address);
  });

export const getBalance = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const { address } = request.query;
      if (!address) {
        response.send({
          code: RETURN_CODE.ERROR_PARAMS,
        });
      } else {
        const balance = await provider.getBalance(address.toString());

        response.send({
          code: RETURN_CODE.SUCCESS,
          address: address,
          balance: ethers.utils.formatEther(balance),
        });
      }
    });
  });

// create NFT
export const createNFT = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const { name, description, url, ar } = request.body;
      functions.logger.info("createNFT", { name, description, url, ar });

      if (!(name && description && url && ar)) {
        response.send({
          code: RETURN_CODE.ERROR_PARAMS,
        });
      } else {
        const signer = await getCreator();
        const marketContract = getMarketContract(signer);
        const nftContract = getNFTContract(signer);
        let listingPrice = await marketContract.getListingPrice();
        listingPrice = listingPrice.toString();

        const metaData = { name, description, url, ar };
        const tokenTx = await nftContract
          .connect(signer)
          .createToken(JSON.stringify(metaData));
        await tokenTx.wait();

        // 获取某地址当前拥有的该 NFT 数量
        const count = await nftContract.balanceOf(signer.address);
        console.log("count=", count);

        response.send({
          code: RETURN_CODE.SUCCESS,
          tokenId: Number(count),
        });
      }
    });
  });

// get NFT meta data
export const getNFTData = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const { tokenId } = request.query;
      if (!tokenId) {
        response.send({
          code: RETURN_CODE.ERROR_PARAMS,
        });
      } else {
        const signer = await getCreator();
        const nftContract = getNFTContract(signer);

        let data = await nftContract.tokenURI(BigNumber.from(tokenId));
        response.send({
          code: RETURN_CODE.SUCCESS,
          data,
        });
      }
    });
  });

// put NFT into Market
export const createMarketItem = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const { tokenId, etherValue } = request.body;
      if (!tokenId || !etherValue) {
        response.send({
          code: RETURN_CODE.ERROR_PARAMS,
        });
      } else {
        const creator = await getCreator();
        const marketContract = getMarketContract(creator);
        const nftContract = getNFTContract(creator);
        let listingPrice = await marketContract.getListingPrice();
        const price = ethers.utils.parseUnits(etherValue.toString(), "ether"); // 转换成 wei
        console.log("listingPrice=", listingPrice.toString());
        console.log("price=", price.toString());

        const tx = await marketContract.createMarketItem(
          nftContract.address,
          BigNumber.from(tokenId),
          price,
          {
            value: listingPrice,
            gasLimit: 3000004, // fix gas estimation
          }
        );
        await tx.wait();
        response.send({
          code: RETURN_CODE.SUCCESS,
        });
      }
    });
  });

// TODO: 分页
export const fetchAllMarketItems = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const nfts = await getAllNFTs();
      response.send({
        code: RETURN_CODE.SUCCESS,
        data: nfts,
      });
    });
  });

// for frontend display
export const getNFTMarketData = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const { tokenId } = request.query;
      if (!tokenId) {
        response.send({
          code: RETURN_CODE.ERROR_PARAMS,
        });
      } else {
        console.log("1111");
        const nfts = await getAllNFTs();
        console.log("222", nfts);
        const item = nfts.find((nft) => nft.tokenId == tokenId.toString());
        if (item) {
          item.price = ethers.utils.formatEther(item.price).toString();
        }
        response.send({
          code: RETURN_CODE.SUCCESS,
          data: item,
        });
      }
    });
  });

// buy NFT
export const buyNFT = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const { nftId, etherValue } = request.body;
      if (!nftId) {
        response.send({
          code: RETURN_CODE.ERROR_PARAMS,
          data: {},
        });
      } else {
        try {
          const buyer = await getBuyer();
          const marketContract = getMarketContract(buyer);
          const nftContract = getNFTContract(buyer);
          const auctionPrice = ethers.utils.parseUnits(etherValue, "ether");
          console.log("auctionPrice=", auctionPrice.toString());
          const tx = await marketContract
            .connect(buyer)
            .createMarketSale(nftContract.address, Number(nftId), {
              value: auctionPrice,
              gasLimit: 3000008,
            });
          await tx.wait();
          response.send({
            code: RETURN_CODE.SUCCESS,
          });
        } catch (e: any) {
          response.send({
            code: RETURN_CODE.ERROR_ETHER,
            error: e.toString(),
          });
        }
      }
    });
  });

// get My NFT
export const getMyNFTs = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const buyer = await getBuyer();
      const marketContract = getMarketContract(buyer);
      const nftContract = getNFTContract(buyer);
      let myNFTs = await marketContract.connect(buyer).fetchMyNFTs();
      const data = await Promise.all(
        myNFTs
          .filter((nft: any) => nft.tokenId.toNumber() > 0)
          .map(async (i: any) => {
            const tokenUri = await nftContract.tokenURI(i.tokenId);
            return {
              price: i.price.toString(),
              tokenId: i.tokenId.toString(),
              seller: i.seller,
              owner: i.owner,
              tokenUri,
            };
          })
      );

      response.send({
        code: RETURN_CODE.SUCCESS,
        data,
      });
    });
  });
