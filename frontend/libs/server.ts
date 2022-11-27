import { get, post } from "./axios";

export type SimpleMarketItem = {
  tokenUri: string;
  price: string;
  nftId: string;
  seller: string;
  owner: string;
  tokenId: string;
  sold: boolean;
};

export const getNFTData = (tokenId: number | string): Promise<string> => {
  return get("/getNFTData", { tokenId });
};

export const getNFTMarketData = (
  tokenId: number | string
): Promise<SimpleMarketItem> => {
  return get("/getNFTMarketData", { tokenId });
};

export const buyNFT = (
  nftId: number | string,
  etherValue: string
): Promise<string> => {
  return post("/buyNFT", { nftId, etherValue });
};

export const fetchAllMarketItems = (): Promise<Array<SimpleMarketItem>> => {
  return get("/fetchAllMarketItems");
};

export const getMyNFTs = (): Promise<Array<SimpleMarketItem>> => {
  return get("/getMyNFTs");
};
