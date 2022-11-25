# Contract
1. Use HardHat to deploy and test Contract
2. Extends openzeppelin

Plans:
- [x] NFT 价值设定
- [x] 如何获取所有的 NFT
- [x] 如何获取某个用户在本应用 Mint 到的 NFT

## How to start?
run `npx hardhat test` under the contract folder. If you occur some start problems, try delete package-lock.json or yarn.lock and run `npm install` or `yarn install` again.

# FrontEnd
1. Use React+typescript
2. Mobile Web
3. use [vercel](https://vercel.com/) to deploy. It is very easy!

## Plans:
- [x] 增加 Claim 过程交互
- [ ] 查看所有已经 Mint 到的 NFT
- [ ] 查看当前所有隐藏的 NFT

##  How to start?
```
npm install # for the first time
npm dev
```

## How to deploy?

This project use [vercel](https://vercel.com/) to deploy. It is very easy!

[website](https://arnft-seven.vercel.app/nft/15)

# BackEnd
1. Use Koa framework to wirte web API
2. Use EtherJS to interact with Ethereum



## How to start?
```
cd backend
npm install # for the first time
npm run start # or npm run watch(which can update when your code changes)
```

if start sucessfully, open [localhost](http://localhost:9000/ether/test) on your browser for a simple test.

# Server

## shell
```
// 本地开发调试 
cd server/functions
npm run serve

// 部署
firebase deploy
```

## API 调用示例

local：http://127.0.0.1:5001/test-35968/asia-east2/getBalance?address=0x3d71519280e40f6ec003645c86761EF479040002

server: https://asia-east2-test-35968.cloudfunctions.net/getBalance?address=0x3d71519280e40f6ec003645c86761EF479040002

## Plans:
- [ ] 数据存储
- [ ] 用户身份处理
- [ ] 和 ethereum 交互，将功能封装成接口
  - [x] 将 NFT 发布到 Market
  - [ ] 购买 NFT 报错！
  - [x] 查询已购买
  - [x] 查询未销售
