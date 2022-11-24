import { get } from "./axios";

// type NFTDataResponse = {
//   code: number;
//   data: string;
// };
export const getNFTData = (tokenId: number | string): Promise<string> => {
  return get("/getNFTData", { tokenId });
};
