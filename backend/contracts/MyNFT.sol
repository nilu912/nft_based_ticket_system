// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract MyNFT is ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor() 
        ERC721("My Token", "G")
        Ownable()
    {}

    // Override supportsInterface to resolve multiple inheritance
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Override tokenURI to resolve multiple inheritance
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function mintNFT(address recipient, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);
        return newItemId;
    }
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
function burnNFT(uint256 tokenId) public {
    require(
        ERC721._isApprovedOrOwner(_msgSender(), tokenId) || owner() == _msgSender(),
        "Caller is not token owner, approved, or contract owner"
    );
    _burn(tokenId);
}
}
// 0x4F647dbbF43246F6DFbAD7d886F576f095Ec027C

// pragma solidity >=0.5.0 <0.9.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// contract MyNFT is ERC721URIStorage, Ownable {
//     using Counters for Counters.Counter;

//     Counters.Counter private _tokenIds;

//     constructor() ERC721("My Token", "G") {}

//     function mintNFT(address recipient, string memory tokenURI)
//         public
//         onlyOwner
//         returns (uint256)
//     {
//         _tokenIds.increment();

//         uint256 newItemId = _tokenIds.current();
//         _mint(recipient, newItemId);
//         _setTokenURI(newItemId, tokenURI);
//         return newItemId;
//     }
// }