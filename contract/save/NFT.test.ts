import { expect } from "chai";
import { ethers } from "hardhat";
import * as jsonData from "../constants/ar.json";

// describe("Given ARNFT", function () {
//   it("Should be able to award", async function () {
//     const [owner, otherAddress, ...rest] = await ethers.getSigners();
//     const ARNFT = await ethers.getContractFactory("ARNFT");
//     const arNFT = await ARNFT.deploy();
//     await arNFT.deployed();

//     const metadata = {
//       name: "Nike Pegasus",
//       description:
//         "Let the Nike Air Zoom Pegasus 39 PRM help you ascend to new heights, whether you're training or jogging, with its intuitive design. This version has a brightly colored exterior that announces your presence on the road. Time to fly.",
//       url: "https://developer.apple.com/augmented-reality/quick-look/models/nike-pegasus/nike-pegasus_2x.png",
//       ar: "https://developer.apple.com/ar/photogrammetry/PegasusTrail.usdz",
//       hash: "00001",
//     };

//     let tx = await arNFT.awardItem(
//       owner.address,
//       "00001",
//       JSON.stringify(metadata)
//     );
//     await tx.wait();

//     let tokenOwner = await arNFT.ownerOf(0);
//     expect(tokenOwner).to.equal(owner.address);

//     // 传入 tokenId, 获取对应链上存储的元数据
//     let data = await arNFT.tokenURI(0);
//     expect(data).to.equal(JSON.stringify(metadata));

//     // 这个函数可以获取某地址当前拥有的该 NFT 数量
//     let balance = await arNFT.balanceOf(owner.address);
//     console.log(`balance=${balance}`);
//   });
// });

describe("Given MyNFT", function () {
  it("Should be able to award", async function () {
    const [owner, otherAddress] = await ethers.getSigners(); // local address
    const nftContract = await ethers.getContractFactory("MyNFT");
    const nft = await nftContract.deploy();
    await nft.deployed();

    const models = jsonData.models;

    let tx = await nft.connect(owner).awardItem(JSON.stringify(models[0]));
    await tx.wait();

    let tx2 = await nft
      .connect(otherAddress)
      .awardItem(JSON.stringify(models[1]));
    await tx2.wait();

    // totalSupply 可以获取所有在链上已经 mint 出的 NFT 数量
    const supplys = await nft.totalSupply();
    expect(supplys).to.equal(2);

    // ownerOf: tokenId --> address
    let tokenOwner = await nft.ownerOf("1");
    expect(tokenOwner).to.equal(owner.address);

    // data: 获取下标对应的元数据
    const data = await nft.data(0);
    expect(data).to.equal(JSON.stringify(models[0]));

    // balanceOf: 获取某地址当前拥有的该 NFT 数量
    let count = await nft.balanceOf(owner.address);
    expect(count).to.equal(1);

    // 配合 balanceOf 使用, 可以知道这个地址在链上所有的 NFT
    for (let i = 0; i < count.toNumber(); i++) {
      const tokenId = await nft.tokenByIndex(i);
      const data = await nft.tokenURI(tokenId);
      // console.log("index=" + i + ";tokenId=" + tokenId + ";data=" + data);
    }

    // 配合 totalSupply 使用，可以知道链上所有的 NFT
    for (let i = 0; i < supplys.toNumber(); i++) {
      const tokenId = await nft.tokenByIndex(i);
      const data = await nft.tokenURI(tokenId);
      // console.log("index=" + i + ";tokenId=" + tokenId + ";data=" + data);
    }
  });
});
