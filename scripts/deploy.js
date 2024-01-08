// Import the Hardhat Runtime Environment
const hre = require("hardhat");

// The main function for deploying the NFT smart contract
async function main() {
  // Define the name of the NFT collection
  const NAME = "AI Generated NFT";
  // Define the symbol for the NFT collection
  const SYMBOL = "AINFT";
  // Define the cost to mint an NFT, set to 1 ETH here
  const COST = ethers.utils.parseUnits("1", "ether"); // 1 ETH

  // Get the contract factory for the 'NFT' contract
  const NFT = await hre.ethers.getContractFactory("NFT");
  // Deploy the contract with the specified NAME, SYMBOL, and COST
  const nft = await NFT.deploy(NAME, SYMBOL, COST);
  // Wait until the contract is fully deployed
  await nft.deployed();

  // Log the address of the deployed contract
  console.log(`Deployed NFT Contract at: ${nft.address}`);
}

// This pattern allows the use of async/await and handles any errors that occur during deployment
main().catch((error) => {
  // Log any errors that occur
  console.error(error);
  // Set the process exit code to indicate failure
  process.exitCode = 1;
});
