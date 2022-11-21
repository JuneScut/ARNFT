import { BigNumber, ethers } from "ethers";
import * as functions from "firebase-functions";
import { RETURN_CODE } from "./utils/constant";
import { getMarketContract, getNFTContract, getRoles } from "./utils/tool";
// import * as admin from "firebase-admin";

// admin.initializeApp();

export const helloWorld = functions
  .region("asia-east2")
  .https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase, ellilachen!");
  });

export const getBalance = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    const { address } = request.query;
    if (!address) {
      response.send({
        code: RETURN_CODE.ERROR_PARAMS,
      });
    } else {
      const { provider } = getRoles();
      const balance = await provider.getBalance(address.toString());

      response.send({
        code: RETURN_CODE.SUCCESS,
        address: address,
        balance: ethers.utils.formatEther(balance),
      });
    }
  });

// create NFT
export const createNFT = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    const { name, description, url, ar } = request.body;
    functions.logger.info("createNFT", { name, description, url, ar });

    if (!(name && description && url && ar)) {
      response.send({
        code: RETURN_CODE.ERROR_PARAMS,
      });
    } else {
      const { signer } = getRoles();
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

// get NFT meta data
export const getNFTData = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    const { tokenId } = request.query;
    if (!tokenId) {
      response.send({
        code: RETURN_CODE.ERROR_PARAMS,
      });
    } else {
      const { signer } = getRoles();
      const nftContract = getNFTContract(signer);

      let data = await nftContract.tokenURI(BigNumber.from(tokenId));
      response.send({
        code: RETURN_CODE.SUCCESS,
        data,
      });
    }
  });

// put NFT into Market
export const createMarketItem = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    const { tokenId, etherValue } = request.body;
    if (!tokenId || !etherValue) {
      response.send({
        code: RETURN_CODE.ERROR_PARAMS,
      });
    } else {
      const { signer } = getRoles();
      const marketContract = getMarketContract(signer);
      const nftContract = getNFTContract(signer);
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

// TODO: 分页
export const fetchMarketItems = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    const { signer } = getRoles();
    const nftContract = getNFTContract(signer);
    const marketContract = getMarketContract(signer);

    let arrayItems = await marketContract.fetchMarketItems();
    const nfts = await Promise.all(
      arrayItems.map(async (i: any) => {
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
      nfts,
    });
  });

// buy NFT
export const buyNFT = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    const { tokenId, etherValue } = request.body;
    if (!tokenId) {
      response.send({
        code: RETURN_CODE.ERROR_PARAMS,
      });
    } else {
      try {
        const { buyer } = getRoles();
        const marketContract = getMarketContract(buyer);
        const nftContract = getNFTContract(buyer);
        const auctionPrice = ethers.utils.parseUnits(etherValue, "ether");
        console.log("auctionPrice=", auctionPrice.toString());
        const tx = await marketContract
          .connect(buyer)
          .createMarketSale(nftContract.address, tokenId, {
            value: auctionPrice,
            gasLimit: 3000004,
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

// get My NFT
export const getMyNFTs = functions
  .region("asia-east2")
  .https.onRequest(async (request, response) => {
    const { buyer } = getRoles();
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
