// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

error Ballot__AlreadyMinted(address minter);

contract Ballot is ERC721, EIP712, ERC721Votes {
    string public constant TOKEN_URI = "ipfs://QmVGqQistKuwe5PVZwvGdaQ8FExvzto4omNveNz8HxvxNR";
    uint256 private s_tokenCounter;
    mapping(address => bool) private hasMinted;

    constructor() ERC721("Ballot", "B") EIP712("Ballot", "1") {
        s_tokenCounter = 0;
    }

    function mintNFT() public returns (uint256) {
        if (hasMinted[msg.sender]) {
            revert Ballot__AlreadyMinted(msg.sender);
        }
        hasMinted[msg.sender] = true;

        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        return s_tokenCounter;
    }

    function tokenURI(uint256 /*tokenId*/) public pure override returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function numCheckpoints(address account) public view virtual returns (uint32) {
        return _numCheckpoints(account);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Votes) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Votes) {
        super._increaseBalance(account, value);
    }
}
