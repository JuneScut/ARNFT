import { useEffect, useRef, useState } from "react";
import type { LottiePlayer } from "lottie-web";
import { useRouter } from "next/router";
import { getNFTMarketData } from "../libs/server";
import { Avatar, Space } from "antd-mobile";
import { StorageKey } from "../libs/constant";

export default function Success() {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const [name, setName] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [seller, setSeller] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ar, setAr] = useState<string>("");

  const router = useRouter();
  const { tokenId } = router.query;

  useEffect(() => {
    const nftData = window.localStorage.getItem(StorageKey.NFTData);
    if (nftData) {
      const data = JSON.parse(nftData);
      const { name, url, ar } = data;
      setName(name);
      setUrl(url);
      setAr(ar);
    }
    import("lottie-web").then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    tokenId &&
      getNFTMarketData(tokenId.toString()).then((res) => {
        if (res) {
          const { price, tokenId, seller, owner } = res;
          setOwner(owner);
          setSeller(seller);
        } else {
          router.push("/404");
        }
      });
  }, [tokenId]);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "/congratulation.json", // path to your animation file, place it inside public folder
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  const lookMore = () => {
    router.push("/");
  };

  const MyOwnNFTs = () => {
    console.log("MyOwnNFTs");
  };

  return (
    <div className="main">
      <div ref={ref} style={{ position: "absolute", zIndex: "9999" }}></div>
      <h3>Bravo! You got {name}</h3>
      <Space block wrap align="center">
        <Avatar src="/avatar.jpeg" />
        <div>
          <p>Address: {owner.substring(0, 5) + "..." + owner.slice(-3)}</p>
          <p>Collection Number: {tokenId}</p>
        </div>
      </Space>
      <div className="nft-model">
        <a rel="ar" href={ar}>
          <img src={url} />
        </a>
      </div>
      <div className="btn-wrapper">
        <button className="learn-more" onClick={lookMore}>
          <span className="circle" aria-hidden="true">
            <span className="icon arrow"></span>
          </span>
          <span className="button-text">Market</span>
        </button>
      </div>
      <Space />
      <div className="btn-wrapper">
        <button className="learn-more" onClick={MyOwnNFTs}>
          <span className="circle" aria-hidden="true">
            <span className="icon arrow"></span>
          </span>
          <span className="button-text">Own NFTs</span>
        </button>
      </div>
    </div>
  );
}
