// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; 
import "hardhat/console.sol";

contract ARNftMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; 
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listingPrice = 0.0 ether;
    
    constructor() {
        owner = payable(msg.sender);
    }
    // define the properties of sale
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    mapping(uint256 => MarketItem) private idToMarketItem;
    // emitter
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    // return price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
    
    // add one nft to market
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        // require(price > 0, "Price must be at least 1 wei"); // 防止免费交易
        require(msg.value == listingPrice, "Price must be equal to listing price"); // 交易价格必须和NFT单价相等
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        idToMarketItem[itemId] =  MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId); // 将NFT的所有权转让给合同
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }
    
    function createMarketSale(
        address nftContract,
        uint256 itemId
        ) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        
        require(msg.value == price, "Please submit the asking price in order to complete the purchase"); // 如果要价不满足会不会产生误差
        idToMarketItem[itemId].seller.transfer(msg.value); // 将价值转移给卖方
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        console.log("Nft Contract Address:",nftContract);
        console.log("tokenId:",tokenId);
        payable(owner).transfer(listingPrice);
    }
    // fetch something
    function fetchSomething() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {  
                uint currentId =  i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId]; 
                items[currentIndex] = currentItem;
                currentIndex += 1;
            } 
        }
        return items;
    }

    // fetch all unsold nfts
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current(); // 更新数量
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount); // 如果地址为空(未出售的项目)，将填充数组
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {  
                uint currentId =  i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId]; 
                items[currentIndex] = currentItem;
                currentIndex += 1;
            } 
        }
        return items;
    }
    // fetch nft from customer
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        for (uint i = 0; i < totalItemCount; i++) {
            for (uint j = 0; j < totalItemCount; j++) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId =  i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    // fetch nfts created by seller
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount); 
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}