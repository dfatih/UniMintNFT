pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol"; // Counters.sol provides a counter utility to safely increment or decrement numbers
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // ERC721.sol is the standard implementation of the ERC721 interface for NFTs
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // ERC721URIStorage.sol extends ERC721 with functionalities to manage URIs for metadata

contract NFT is
    ERC721URIStorage // Main contract for the NFT, extends ERC721URIStorage for NFT functionalities
{
    // The NFT contract: This contract handles the creation and management of the NFTs.
    using Counters for Counters.Counter; // Utilizes the Counter utility to keep track of the current number of minted tokens
    Counters.Counter private _tokenIds;  // Utilizes the Counter utility to keep track of the current number of minted tokens

    address public owner; // Stores the Ethereum address of the contract owner, set during contract deployment
    uint256 public cost; // Sets the cost for minting a new NFT, adjustable by the contract owner

    constructor(
        // The constructor is executed once upon contract deployment. It initializes the NFT name and symbol.
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
        cost = _cost;
    }

    // Function to mint a new NFT
    function mint(string memory tokenURI) public {
        // Check if the sent value is at least equal to the cost of minting
        require(msg.value >= cost, "Insufficient funds to mint");

        // Increment the token ID counter to ensure each token has a unique ID
        _tokenIds.increment();

        // Retrieve the new token ID
        uint256 newItemId = _tokenIds.current();

        // Mint the new token. The '_mint' function is an internal function from the ERC721 standard
        _mint(msg.sender, newItemId);

        // Set the token URI (Uniform Resource Identifier) for the newly minted token
        // The token URI is typically a link to the token's metadata
        _setTokenURI(newItemId, tokenURI);
    }

    // Function to get the total supply of minted NFTs
    function totalSupply() public view returns (uint256) {
        // Returns the current value of the token ID counter
        // This effectively gives the total number of tokens that have been minted
        return _tokenIds.current();
    }

    // Function to withdraw all Ether from the contract
    function withdraw() public {
        // Only the owner of the contract can withdraw
        require(msg.sender == owner, "Caller is not the owner");

        // Sending all the Ether stored in the contract to the owner
        // The 'call' function is a low-level function for sending Ether
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
