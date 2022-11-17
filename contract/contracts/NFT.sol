// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ARNFT is ERC721URIStorage, IERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string[] public tokenURIs;

    constructor() ERC721("ARNFT", "ARNFT") {}

    // function mint(address _to, uint256 _tokenId, string calldata _uri) external onlyOwner {
    //     super._mint(_to, _tokenId); // 使用接收方的地址和代币 ID 来铸造代币
    //     super._setTokenUri(_tokenId, _uri); // 使用代币 id 和 JSON 文件的 URI 设置代币 URI。
    // }

    function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        tokenURIs.push(tokenURI);
        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
}
