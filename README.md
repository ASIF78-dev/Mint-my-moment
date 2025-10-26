# Mint My Moment

> Turn your favorite moments into on-chain collectibles in seconds

Mint My Moment is a decentralized NFT minting platform that allows users to transform their digital memories—photos, videos, and other media—into unique, collectible NFTs across multiple blockchain networks.

## 🚀 Features

- **🎨 Easy NFT Minting** - Transform any digital file into an NFT
- **🌐 Multi-Chain Support** - Deploy on Ethereum, Polygon, Base, and Solana
- **📱 Drag & Drop Interface** - Intuitive file upload with preview
- **🔗 Wallet Integration** - MetaMask and other wallet support
- **⚡ Instant Preview** - Real-time file preview and metadata
- **🎯 Custom Metadata** - Add titles, descriptions, and edition sizes
- **💎 ERC-721 Standard** - Full NFT compatibility and ownership
- **🚀 One-Click Deploy** - Simple contract deployment across networks

## 🎯 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Test ETH for gas fees (on testnets)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Mint-my-moment.git
cd Mint-my-moment

# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Deploy to testnet (optional)
npm run deploy:sepolia
# or
npm run deploy:polygon
# or  
npm run deploy:base

# Start local development
# Simply open index.html in your browser
# or use a local server:
npx http-server . -p 3000
```

### How to Use

1. **Open the App** - Navigate to the Mint My Moment web interface
2. **Connect Wallet** - Click "Connect Wallet" and select MetaMask
3. **Select Network** - Choose your preferred blockchain network
4. **Upload File** - Drag & drop or browse to select your digital file
5. **Add Metadata** - Fill in title, creator name, and edition size
6. **Preview** - Review your NFT preview and metadata
7. **Mint** - Click "Mint Now" to create your NFT on-chain

### Example Usage

```javascript
// The app automatically handles:
// 1. File upload and preview
// 2. Metadata collection
// 3. Smart contract interaction
// 4. NFT minting transaction

// Smart contract call (handled by the frontend):
await contract.mintMoment(
  "My Amazing Sunset",     // title
  "A beautiful sunset...", // description  
  "John Doe",             // creator
  1,                      // edition size
  "ipfs://Qm..."          // metadata URI
);
```

## 🔗 Smart Contracts

Mint My Moment uses two main smart contracts:

### MintMyMoment.sol
The main interface contract that handles moment minting:

```solidity
interface IMintMyMoment {
    function mintMoment(
        string calldata title,
        string calldata description,
        string calldata creator,
        uint256 editionSize,
        string calldata uri
    ) external;
}
```

### MomentERC721.sol
Standard ERC-721 NFT contract with custom URI support:

```solidity
contract MomentERC721 is ERC721, Ownable {
    function safeMint(address to, string memory uri) public onlyOwner;
    function tokenURI(uint256 tokenId) public view override returns (string memory);
}
```

### Security Features

- **OpenZeppelin Standards** - Built on battle-tested ERC-721 implementation
- **Owner Controls** - Only authorized addresses can mint NFTs
- **Input Validation** - All parameters validated before minting
- **Gas Optimization** - Efficient contract design for lower transaction costs

## 🧪 Testing

Run the Hardhat test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npx hardhat coverage

# Test on local network
npm run node
# In another terminal:
npm run deploy:local
```

**Test Coverage:**
- ✅ Smart contract compilation
- ✅ Contract deployment across networks
- ✅ NFT minting functionality
- ✅ Metadata handling
- ✅ Wallet integration

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐
│      User       │    │   Web Browser    │
│  Uploads File   │────│   Frontend UI    │
└─────────┬───────┘    └──────────────────┘
          │                      │
          ▼                      │ File Preview
┌─────────────────────────────────┐      │
│     Mint My Moment DApp         │      │
│  ┌──────────────────────────┐   │      │
│  │ 1. File Processing       │   │      │
│  │    - Drag & drop         │   │      │
│  │    - File validation     │   │      │
│  │    - Preview generation  │   │      │
│  └──────────────────────────┘   │      │
│  ┌──────────────────────────┐   │      │
│  │ 2. Metadata Collection   │   │      │
│  │    - Title & description │   │      │
│  │    - Creator info        │   │      │
│  │    - Edition size        │   │      │
│  └──────────────────────────┘   │      │
└─────────────────────────────────┘      │
                                         │
┌─────────────┐                         │
│   Wallet    │◄────────────────────────┘
│ Connection  │
└──────┬──────┘
       │ Transaction
       ▼
┌─────────────────────────────────┐
│      Smart Contract             │
│  ┌──────────────────────────┐   │
│  │ 1. Mint Validation       │   │
│  │    - Input validation    │   │
│  │    - Gas estimation      │   │
│  │    - Permission check    │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ 2. NFT Creation          │   │
│  │    - ERC-721 mint        │   │
│  │    - Metadata storage    │   │
│  │    - Token ID assign     │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │ 3. Event Emission        │   │
│  │    - MomentMinted event  │   │
│  │    - Transfer event      │   │
│  │    - Update UI           │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

## 🔧 Frontend Components

### File Upload Component
Handles drag & drop file uploads with preview:

```javascript
// File validation and preview
function handleFileUpload(file) {
  if (!file) return;
  
  // Validate file type and size
  const validTypes = ['image/*', 'video/*', 'audio/*'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  // Generate preview
  const preview = generatePreview(file);
  updateUI(preview);
}
```

### Wallet Integration
MetaMask and Web3 wallet connection:

```javascript
// Connect to wallet
async function connectWallet() {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    return accounts[0];
  }
}

// Switch network
async function switchNetwork(chainId) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${chainId.toString(16)}` }]
  });
}
```

### Smart Contract Interaction
Direct contract calls for minting:

```javascript
// Mint NFT
async function mintNFT(metadata) {
  const contract = new ethers.Contract(
    contractAddress, 
    contractABI, 
    signer
  );
  
  const tx = await contract.mintMoment(
    metadata.title,
    metadata.description,
    metadata.creator,
    metadata.editionSize,
    metadata.uri
  );
  
  return await tx.wait();
}
```

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3/JavaScript** - Modern web standards
- **Web3.js/Ethers.js** - Blockchain interaction
- **MetaMask Integration** - Wallet connectivity
- **Responsive Design** - Mobile-friendly interface

### Smart Contracts
- **Solidity ^0.8.24** - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security-audited contract libraries
- **ERC-721** - NFT standard implementation

### Blockchain Networks
- **Ethereum** - Mainnet and Sepolia testnet
- **Polygon** - Mainnet and Mumbai testnet  
- **Base** - Mainnet and Sepolia testnet
- **Solana** - Alternative blockchain support

### Development Tools
- **Node.js** - Runtime environment
- **npm** - Package management
- **Git** - Version control

## 🔐 Security Features

### Smart Contract Security
- **OpenZeppelin Standards** - Industry-standard secure implementations
- **Access Control** - Owner-only minting functions
- **Input Validation** - Comprehensive parameter checking
- **Reentrancy Protection** - Built-in security patterns

### Frontend Security
- **Client-side Validation** - File type and size restrictions
- **Wallet Integration** - Secure Web3 provider connections
- **Transaction Verification** - Confirmation before execution
- **Error Handling** - Graceful failure management

Example security check:
```javascript
// Input validation before minting
function validateMintData(data) {
  if (!data.title || data.title.length === 0) {
    throw new Error("Title is required");
  }
  if (data.editionSize <= 0) {
    throw new Error("Edition size must be greater than 0");
  }
  if (!data.uri || data.uri.length === 0) {
    throw new Error("Metadata URI is required");
  }
}
```

## 📝 Environment Variables

```bash
# Required for deployment
PRIVATE_KEY=0x...                        # Private key for contract deployment
SEPOLIA_RPC_URL=https://...              # Sepolia testnet RPC URL
MUMBAI_RPC_URL=https://...               # Mumbai testnet RPC URL  
BASE_SEPOLIA_RPC_URL=https://...         # Base Sepolia testnet RPC URL

# Optional for verification
ETHERSCAN_API_KEY=your-key               # Etherscan API key
POLYGONSCAN_API_KEY=your-key             # Polygonscan API key
BASESCAN_API_KEY=your-key                # Basescan API key

# Development
NODE_ENV=development                     # Environment mode
```

## 🚀 Deployment

### Smart Contract Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Mumbai testnet  
npm run deploy:polygon

# Deploy to Base Sepolia testnet
npm run deploy:base

# Deploy to local network
npm run node
npm run deploy:local
```

### Frontend Deployment

```bash
# Static hosting (Netlify, Vercel, GitHub Pages)
# Simply upload the files:
# - index.html
# - styles.css
# - script.js
# - favicon.svg

# Or use a simple HTTP server
npx http-server . -p 3000
```

## 📚 Usage Examples

### For NFT Creators

1. **Open the app** in your web browser
2. **Connect your wallet** (MetaMask recommended)
3. **Select your network** (Ethereum, Polygon, Base, etc.)
4. **Upload your file** using drag & drop or browse
5. **Fill in metadata** (title, description, creator, edition size)
6. **Preview your NFT** before minting
7. **Click "Mint Now"** to create your NFT on-chain

### For Collectors

1. **Browse minted NFTs** on OpenSea, Rarible, or other marketplaces
2. **View NFT metadata** and original content
3. **Purchase NFTs** using your preferred marketplace
4. **Transfer or trade** your collected moments
5. **Display in wallets** or NFT galleries

## 🤝 Contributing

Contributions welcome! Help us improve the NFT minting experience:

- **Bug Reports** - Submit issues on GitHub
- **Feature Requests** - Suggest new functionality
- **Code Contributions** - Submit pull requests
- **Documentation** - Improve guides and examples
- **Testing** - Help test on different networks and devices

## 📄 License

MIT

## 🔗 Links

- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- [Hardhat Framework](https://hardhat.org/)
- [MetaMask Wallet](https://metamask.io/)
- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [Ethereum](https://ethereum.org/) | [Polygon](https://polygon.technology/) | [Base](https://base.org/)

---

Built with ❤️ - ETH Online 2025