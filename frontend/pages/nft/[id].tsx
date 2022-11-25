import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { getNFTData } from "../../libs/server";

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
  // NFT info
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ar, setAr] = useState<string>("");

  const router = useRouter();
  const { id } = router.query;

  const getData = () => {
    if (id) {
      getNFTData(id.toString()).then((res: string) => {
        if (res) {
          const data = JSON.parse(res);
          const { name, description, url, ar } = data;
          setName(name);
          setDescription(description);
          setUrl(url);
          setAr(ar);
          setLoading(false);
        } else {
          router.push("/404");
        }
      });
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const onClick = useCallback(async () => {}, []);

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
        <a onClick={onClick} className="submit" data-title="Claim"></a>
      </div>
    </div>
  );
}

export default NFT;
