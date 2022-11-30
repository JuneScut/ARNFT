import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { buyNFT, getNFTMarketData } from "../../libs/server";
import { Dialog, DotLoading, Space } from "antd-mobile";
import { StorageKey } from "../../libs/constant";
import Loading from "../../components/Loading";
import { MarketItem } from "..";

function NFT() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tradingLoading, setTradingLoading] = useState<boolean>(false);
  // NFT info
  const [marketItem, setMarketItem] = useState<MarketItem>();

  const router = useRouter();
  const { id } = router.query;

  const getData = () => {
    if (id) {
      getNFTMarketData(id.toString()).then((res) => {
        if (res) {
          const { price, tokenUri, nftId } = res;
          const data = JSON.parse(tokenUri);
          setMarketItem({
            ...res,
            content: data,
          });
          setLoading(false);
          try {
            window.localStorage.setItem(StorageKey.NFTData, tokenUri);
          } catch (e) {
            // not enough storage
          }
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
    // router.push({
    //   pathname: "/success",
    //   query: {
    //     tokenId: id,
    //   },
    // });
    if (tradingLoading || !marketItem) {
      return;
    }
    Dialog.confirm({
      title: "Comfirmation",
      content: `Are you sure to consume ${marketItem.price} ether to claim this NFT?`,
      cancelText: "Cancel",
      confirmText: "Confirm",
      onConfirm: async () => {
        if (id) {
          setTradingLoading(true);
          buyNFT(marketItem.nftId.toString(), marketItem.price).then(
            (res) => {
              router.push({
                pathname: "/success",
                query: {
                  tokenId: id,
                },
              });
              setTradingLoading(false);
            },
            (err) => {
              setTradingLoading(false);
            }
          );
        }
      },
    });
  }, [marketItem, tradingLoading]);

  const jumpToIndex = () => {
    router.push("/");
  };

  const jumpToOwnNFTs = () => {
    router.push("/own");
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="main">
      <h3 className="title">{marketItem?.content.name}</h3>
      <p>{marketItem?.content.description}</p>
      <div className="nft-model">
        <a rel="ar" href={marketItem?.content.ar}>
          <img src={marketItem?.content.url} />
        </a>
      </div>
      {!marketItem?.sold && (
        <div className="btn-wrapper">
          <button className="learn-more" onClick={claimNFT}>
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            {tradingLoading ? (
              <span className="button-text">Waiting... </span>
            ) : (
              <span className="button-text">Claim </span>
            )}
          </button>
        </div>
      )}
      <Space />
      <div className="btn-wrapper">
        <button className="learn-more" onClick={jumpToIndex}>
          <span className="circle" aria-hidden="true">
            <span className="icon arrow"></span>
          </span>
          <span className="button-text">Market</span>
        </button>
      </div>
      <Space />
      {marketItem?.sold && (
        <div className="btn-wrapper">
          <button className="learn-more" onClick={jumpToOwnNFTs}>
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Own NFTs</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default NFT;
