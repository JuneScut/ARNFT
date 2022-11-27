import { useEffect, useRef, useState } from "react";
import { fetchAllMarketItems, SimpleMarketItem } from "../libs/server";
import { Swiper, SwiperRef } from "antd-mobile";
import { useRouter } from "next/router";
import Loading from "../components/Loading";

export type MarketItem = {
  price: string;
  nftId: string;
  seller: string;
  owner: string;
  tokenId: string;
  sold: boolean;
  content: {
    name: string;
    description: string;
    url: string;
    ar: string;
  };
};

export const mapValidNFT = (data: SimpleMarketItem[]) => {
  const validNFTs: MarketItem[] = [];
  data.map((nft) => {
    try {
      const { tokenUri } = nft;
      const data = JSON.parse(tokenUri);
      if (data && data.name && data.url && data.ar) {
        validNFTs.push({ ...nft, content: data });
      }
    } catch (_) {
      // do nothing
    }
  });
  return validNFTs;
};

export default function Index() {
  const [nfts, setNFTs] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const ref = useRef<SwiperRef>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAllMarketItems().then((data) => {
      const validNFTs = mapValidNFT(data);
      setNFTs(validNFTs);
      setLoading(false);
    });
  }, []);

  const jumpToNFT = (tokenId: string) => {
    router.push(`/nft/${tokenId}`);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <div style={{ display: "flex", height: "100vh", alignItems: "center" }}>
        <Swiper
          allowTouchMove={true}
          ref={ref}
          loop
          stuckAtBoundary={false}
          trackOffset={15}
          slideSize={70}
          style={{
            "--border-radius": "8px",
            height: "70vh",
          }}
          defaultIndex={0}
        >
          {nfts.map((nft) => (
            <Swiper.Item
              key={nft.tokenId}
              onClick={() => {
                jumpToNFT(nft.tokenId);
              }}
            >
              <div style={{ paddingLeft: "40px" }}>
                {nft.sold && <img src="/sold.png" width="64"></img>}
              </div>
              <a rel="ar" href={nft.content.ar}>
                <img src={nft.content.url} style={{ width: "100%" }} />
              </a>
              <div style={{ textAlign: "center" }}>
                <h3>{nft.content.name}</h3>
                <p>NO.{nft.tokenId}</p>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
    </>
  );
}
