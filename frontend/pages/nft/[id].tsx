import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { buyNFT, getNFTData, getNFTMarketData } from "../../libs/server";
import { Dialog, DotLoading } from "antd-mobile";

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src="/loading.gif" style={{ width: "100%" }} />
    </div>
  );
};

function NFT() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tradingLoading, setTradingLoading] = useState<boolean>(false);
  // NFT info
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ar, setAr] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const router = useRouter();
  const { id } = router.query;

  const getData = () => {
    if (id) {
      getNFTMarketData(id.toString()).then((res) => {
        if (res) {
          const { price, tokenUri } = res;
          const data = JSON.parse(tokenUri);
          const { name, description, url, ar } = data;
          setName(name);
          setDescription(description);
          setUrl(url);
          setAr(ar);
          setLoading(false);
          setPrice(price);
        } else {
          router.push("/404");
        }
      });
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const claimNFT = useCallback(async () => {
    Dialog.confirm({
      title: "Comfirmation",
      content: `Are you sure to consume ${price} ether to claim this NFT?`,
      cancelText: "Cancel",
      confirmText: "Confirm",
      onConfirm: async () => {
        if (id) {
          setTradingLoading(true);
          buyNFT(id.toString(), price).then(
            (res) => {
              setTradingLoading(false);
            },
            (err) => {
              setTradingLoading(false);
            }
          );
        }
      },
    });
  }, [id, price]);

  return loading ? (
    <Loading />
  ) : (
    <div className="main">
      <h3 className="title">{name}</h3>
      <p>{description}</p>
      <div className="nft-model">
        <a rel="ar" href={ar}>
          <img src={url} />
        </a>
      </div>
      <div className="submit-btn">
        <a onClick={claimNFT} className="submit">
          {tradingLoading ? (
            <DotLoading className="submit-content" color="white" />
          ) : (
            <div className="submit-content">Claim</div>
          )}
        </a>
      </div>
    </div>
  );
}

export default NFT;
