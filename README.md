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
- [ ] 增加 Mint 过程交互
- [ ] 查看所有已经 Mint 到的 NFT
- [ ] 获取当前地点 ID
- [ ] 查看当前地点所有隐藏的 NFT

##  How to start?
```
npm install # for the first time
npm start
```

## How to deploy?

This project use [vercel](https://vercel.com/) to deploy. It is very easy!

[website](https://arnft-seven.vercel.app/)

# BackEnd
1. Use Koa framework to wirte web API
2. Use EtherJS to interact with Ethereum

## Plans:
- [ ] Sql 设计：需要存什么用户信息
- [ ] 用户身份处理
- [ ] 和 ethereum 交互，将功能封装成接口
- [ ] 地点 ID 和 NFT 配置


## How to start?
```
cd backend
npm install # for the first time
npm run start # or npm run watch(which can update when your code changes)
```

if start sucessfully, open [localhost](http://localhost:9000/ether/test) on your browser for a simple test.