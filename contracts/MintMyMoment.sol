// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMintMyMoment {
    function mintMoment(
        string calldata title,
        string calldata description,
        string calldata creator,
        uint256 editionSize,
        string calldata uri
    ) external;
}

contract MintMyMoment is IMintMyMoment {
    event MomentMinted(address indexed minter, string title, string uri);

    function mintMoment(
        string calldata title,
        string calldata /* description */,
        string calldata /* creator */,
        uint256 editionSize,
        string calldata uri
    ) external override {
        require(bytes(title).length > 0, "Title required");
        require(bytes(uri).length > 0, "URI required");
        require(editionSize > 0, "Edition > 0");
        emit MomentMinted(msg.sender, title, uri);
    }
}






