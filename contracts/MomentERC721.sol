// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Minimal ERC-721 reference that exposes safeMint(to, tokenURI)
contract MomentERC721 is ERC721, Ownable {
    uint256 private _nextTokenId;

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("Mint My Moment", "MMM") Ownable(msg.sender) {}

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _tokenURIs[tokenId];
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
    }
}


