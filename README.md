# UniMintNFT
Innovative NFT Minting Project for University Coursework

## Overview
Welcome to UniMintNFT, a cutting-edge project dedicated to exploring the world of NFT minting as part of our university curriculum. This project demonstrates the process of creating and minting unique digital assets on the blockchain.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework & Testing)
- [Chainlink](https://faucets.chain.link/) (Test Network)
- [Axios](https://axios-http.com/docs/intro) (To make API Calls)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [NFT.Storage](https://nft.storage/) (Connection to IPFS)
- [Hugging Face](https://huggingface.co/) (AI Models)


# Getting Started
## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/) v16

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Setup .env file:
Before running any scripts, you'll want to create a .env file with the following values (see .env.example):

- **REACT_APP_HUGGING_FACE_API_KEY=""**
- **REACT_APP_NFT_STORAGE_API_KEY=""**

You'll need to create an account on [Hugging Face](https://huggingface.co/), visit your profile settings, and create a read access token. 

You'll also need to create an account on [NFT.Storage](https://nft.storage/), and create a new API key.

### 4. Run tests
`$ npx hardhat test`

### 5. Start Hardhat node
`$ npx hardhat node`

### 6. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`
put the `Deployed NFT Contract` in address under `config.json`

### 7. Add Network to Metamask
Follow this guide to add Testnet in Metamask [HardhatETH](https://medium.com/@kaishinaw/connecting-metamask-with-a-local-hardhat-network-7d8cea604dc6)

### 8. Start frontend
`$ npm run start`

### Finished Project
![Image](image.png)
