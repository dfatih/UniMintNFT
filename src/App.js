import { useState, useEffect } from 'react'; // React hooks for state and lifecycle management
import { NFTStorage, File } from 'nft.storage' // NFT storage functionality from 'nft.storage'
import { Buffer } from 'buffer'; // Buffer module from Node.js
import { ethers } from 'ethers'; // Ethers library for interacting with the Ethereum blockchain
import axios from 'axios'; // Axios for making HTTP requests

// Components
import Spinner from 'react-bootstrap/Spinner'; // Spinner component from React Bootstrap for loading indicators
import Navigation from './components/Navigation'; // Navigation component for routing

// ABIs
import NFT from './abis/NFT.json' // NFT contract ABI

// Config
import config from './config.json'; // Application configuration file

// Main React component for the application
function App() {
  // State for managing Ethereum provider
  const [provider, setProvider] = useState(null);
  // State for storing the user's account address
  const [account, setAccount] = useState(null);
  // State for the NFT contract
  const [nft, setNFT] = useState(null);

  // States for form inputs: name and description of the NFT
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // State for storing the generated image
  const [image, setImage] = useState(null);
  // State for storing the URL of the uploaded image
  const [url, setURL] = useState(null);

  // State for displaying messages to the user
  const [message, setMessage] = useState("");
  // State to indicate if the process is waiting (e.g., minting or image generation)
  const [isWaiting, setIsWaiting] = useState(false);

  // Function to load blockchain data and initialize the NFT contract
  const loadBlockchainData = async () => {
    // Connect to Ethereum blockchain using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // Get the current network information
    const network = await provider.getNetwork();

    // Initialize the NFT contract with the appropriate network configuration
    const nft = new ethers.Contract(config[network.chainId].nft.address, NFT, provider);
    setNFT(nft);
  };

  // Handler for the form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (name === "" || description === "") {
      window.alert("Please provide a name and description");
      return;
    }

    setIsWaiting(true);

    // Call function to generate an image based on the description
    const imageData = await createImage();

    // Upload the generated image to IPFS (NFT.Storage)
    const url = await uploadImage(imageData);

    // Mint the NFT with the URL of the uploaded image
    await mintImage(url);

    setIsWaiting(false);
    setMessage("");
  };

  // Function to generate an image using an AI model
  const createImage = async () => {
    setMessage("Generating Image...");

    // API endpoint for the AI model
    const URL = `https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5`;

    // Sending the request to the AI model
    const response = await axios({
      url: URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        inputs: description, options: { wait_for_model: true },
      }),
      responseType: 'arraybuffer',
    });

    const type = response.headers['content-type'];
    const data = response.data;

    // Convert the response to a base64 encoded image for rendering
    const base64data = Buffer.from(data).toString('base64');
    const img = `data:${type};base64,` + base64data;
    setImage(img);

    return data;
  };

  // Function to upload the generated image to NFT.Storage
  const uploadImage = async (imageData) => {
    setMessage("Uploading Image...");

    // Create an instance of NFT.Storage with the API key
    const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY });

    // Send the image to NFT.Storage
    const { ipnft } = await nftstorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    });

    // Construct the URL for the uploaded image metadata
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    setURL(url);

    return url;
  };

  // Function to mint the NFT with the given token URI
  const mintImage = async (tokenURI) => {
    setMessage("Waiting for Mint...");

    // Get a signer to sign the mint transaction
    const signer = await provider.getSigner();
    // Create and send the mint transaction
    const transaction = await nft.connect(signer).mint(tokenURI, { value: ethers.utils.parseUnits("1", "ether") });
    await transaction.wait();
  };

  // useEffect hook to load blockchain data when the component mounts
  useEffect(() => {
    loadBlockchainData();
  }, []);

  // Rendering the component UI
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <div className='form'>
        <form onSubmit={submitHandler}>
          <input type="text" placeholder="Create a name..." onChange={(e) => { setName(e.target.value) }} />
          <input type="text" placeholder="Create a description..." onChange={(e) => setDescription(e.target.value)} />
          <input type="submit" value="Create & Mint" />
        </form>

        <div className="image">
          {!isWaiting && image ? (
            <img src={image} alt="AI generated image" />
          ) : isWaiting ? (
            <div className="image__placeholder">
              <Spinner animation="border" />
              <p>{message}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {!isWaiting && url && (
        <p>
          View&nbsp;<a href={url} target="_blank" rel="noreferrer">Metadata</a>
        </p>
      )}
    </div>
  );
}

export default App;
