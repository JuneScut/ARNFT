import { get, post } from "./axios";

// type NFTDataResponse = {
//   code: number;
//   data: string;
// };
export const getNFTData = (tokenId: number | string): Promise<string> => {
  return get("/getNFTData", { tokenId });
};
export const getNFTMarketData = (
  tokenId: number | string
): Promise<{ tokenUri: string; price: string }> => {
  return get("/getNFTMarketData", { tokenId });
};

export const buyNFT = (
  tokenId: number | string,
  etherValue: string
): Promise<string> => {
  return post("/buyNFT", { tokenId, etherValue });
};
