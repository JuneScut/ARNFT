import { useEffect, useState } from "react";
import { mapValidNFT, MarketItem } from ".";
import { getMyNFTs } from "../libs/server";
import { Space, Button } from "antd-mobile";
import { useRouter } from "next/router";
import Loading from "../components/Loading";

export default function OwnNFT() {
  const [loading, setLoading] = useState<boolean>(true);
  const [nfts, setNFTs] = useState<MarketItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    getMyNFTs().then((res) => {
      const validNFTs = mapValidNFT(res);
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
      <div style={{ display: "flex", flexWrap: "wrap", paddingTop: "20px" }}>
        {nfts.map((nft) => (
          <div
            key={`own_${nft.tokenId}`}
            onClick={() => {
              jumpToNFT(nft.tokenId);
            }}
            style={{
              width: "46vw",
              display: "inline-block",
              boxShadow: "0 15px 30px 1px grey",
              background: "rgba(255, 255, 255, 0.90)",
              overflow: "hidden",
              margin: "2vw",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <a rel="ar" href={nft.content.ar}>
              <img src={nft.content.url} style={{ width: "80%" }} />
            </a>
            <div style={{ textAlign: "center" }}>
              <h3>{nft.content.name}</h3>
              <p>NO.{nft.tokenId}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Button
          color="primary"
          shape="rounded"
          fill="solid"
          style={{
            width: "50%",
          }}
          onClick={() => {
            router.back();
          }}
        >
          RETURN
        </Button>
      </div>
    </>
  );
}
