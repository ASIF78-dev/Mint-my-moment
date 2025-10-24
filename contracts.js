// Contract addresses for different networks
// This file will be updated after deployment
const CONTRACT_ADDRESSES = {
  // Testnet addresses (update after deployment)
  sepolia: {
    MomentERC721: "0xd9145CCE52D386f254917e481eB44e9943F39138",
    MintMyMoment: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"
  },
  polygonMumbai: {
    MomentERC721: "",
    MintMyMoment: ""
  },
  baseSepolia: {
    MomentERC721: "",
    MintMyMoment: ""
  },
  // Local development
  localhost: {
    MomentERC721: "",
    MintMyMoment: ""
  }
};

// Helper function to get contract address for current network
function getContractAddress(contractName) {
  const network = getCurrentNetwork();
  return CONTRACT_ADDRESSES[network]?.[contractName] || "";
}

// Helper function to detect current network
function getCurrentNetwork() {
  if (typeof window !== 'undefined' && window.ethereum) {
    // This would need to be updated based on chainId
    // For now, return a default
    return 'sepolia';
  }
  return 'sepolia'; // default
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONTRACT_ADDRESSES, getContractAddress, getCurrentNetwork };
}