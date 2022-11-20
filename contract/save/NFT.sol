// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


// contract ARNFT is ERC721URIStorage {
//     using Counters for Counters.Counter; // Counters用来帮助我们创建递增id的代币
//     Counters.Counter private _tokenIds;
//     mapping(string => uint8) hashes; // 创建一个映射来关联IPFS哈希与代币。 这将有助于防止发行相同哈希值的代币。

//     constructor() ERC721("ARNFT", "NFT") {}

//     /**
//     * player: [address] 收货人的钱包地址
//     * tokenURI: [string] 是与正在创建NFT的内容相关联的IPFS哈希
//     * metadata: [string] 是指向资产的JSON元数据的链接。 元数据可能包括资产名称、指向该资产的图片链接或其他任何你想要的内容
//      */
//     function awardItem(address player, string memory hash, string memory metadata)
//         public
//         returns (uint256)
//     {
//         require(hashes[hash] != 1);
//         hashes[hash] = 1;

//         uint256 newItemId = _tokenIds.current();
//         _mint(player, newItemId); // 使用接收方的地址和代币 ID 来铸造代币
//         _setTokenURI(newItemId, metadata);// 使用代币 id 和 JSON 文件的 URI 设置代币 URI。

//         _tokenIds.increment();
//         return newItemId;
//     }
// }


contract MyNFT is ERC721Enumerable {
    string[] public data;
    mapping(uint => bool) _itemExists;

    constructor() ERC721("MyNFT", "NFT") {}

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist.");
        return data[tokenId-1];
    }

    function awardItem(string memory _metadata) public {
        data.push(_metadata);
        uint _id = data.length;
        _mint(msg.sender, _id);
        _itemExists[_id] = true;
    }
}
