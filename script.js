/* Basic interactivity for Mint My Moment demo */
(function() {
  try {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const browseBtn = document.getElementById('browseBtn');
  const fileMeta = document.getElementById('fileMeta');
  const previewMedia = document.getElementById('previewMedia');
  const mintBtn = document.getElementById('mintBtn');
  const navMintBtn = document.getElementById('navMintBtn');
  const connectBtn = document.getElementById('connectBtn');
  const networkSelect = document.getElementById('networkSelect');
  const addSepoliaBtn = document.getElementById('addSepoliaBtn');
  const walletModal = document.getElementById('walletModal');
  const closeModal = document.getElementById('closeModal');
  const titleInput = document.getElementById('titleInput');
  const creatorInput = document.getElementById('creatorInput');
  const editionInput = document.getElementById('editionInput');
  const contractInput = document.getElementById('contractInput');
  const web3TokenInput = document.getElementById('web3TokenInput');

  // Check for missing elements
  if (!navMintBtn) {
    console.error('navMintBtn element not found!');
  }
  if (!mintBtn) {
    console.error('mintBtn element not found!');
  }
  if (!connectBtn) {
    console.error('connectBtn element not found!');
  }

  // Login and profile sections removed

  function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0; let n = bytes;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)} ${units[i]}`;
  }

  function resetPreview() {
    previewMedia.innerHTML = '';
    fileMeta.textContent = '';
    mintBtn.disabled = true;
    navMintBtn.disabled = true;
  }

  
  const appState = {
    hasFile: false,
    walletConnected: false,
    network: '',
    provider: null,
    signer: null,
    selectedFile: null,
    address: ''
  };

  function updateMintEnabled() {
    const enabled = appState.hasFile && appState.walletConnected && !!appState.network;
    console.log('Update mint enabled:', {
      hasFile: appState.hasFile,
      walletConnected: appState.walletConnected,
      network: appState.network,
      enabled: enabled
    });
    
    // Update main mint button
    if (mintBtn) {
      mintBtn.disabled = !enabled;
    }
    
    // Show/hide nav mint button based on wallet connection
    if (navMintBtn) {
      if (appState.walletConnected) {
        navMintBtn.style.display = 'inline-flex';
        navMintBtn.disabled = !enabled;
      } else {
        navMintBtn.style.display = 'none';
      }
    }
  }

  function updateProfileUI() {
    // Profile UI elements removed - this function kept for compatibility
    console.log('Wallet status:', appState.walletConnected ? `Connected: ${appState.address}` : 'Not connected');
  }

  function showPage(hash) {
    // Navigation simplified - no login/profile sections
    const id = (hash || location.hash || '#').replace('#', '') || '';
    console.log('Navigation to:', id);
    // Main content is always visible
  }

  function isVideo(file) {
    return file && file.type.startsWith('video/');
  }

  function isImage(file) {
    return file && file.type.startsWith('image/');
  }

  function renderPreview(file) {
    previewMedia.innerHTML = '';
    const url = URL.createObjectURL(file);
    let node;
    if (isVideo(file)) {
      node = document.createElement('video');
      node.src = url;
      node.controls = true;
      node.playsInline = true;
      node.style.maxWidth = '100%';
      node.style.maxHeight = '100%';
    } else if (isImage(file)) {
      node = document.createElement('img');
      node.src = url;
      node.alt = titleInput.value || 'Uploaded image';
      node.style.maxWidth = '100%';
      node.style.maxHeight = '100%';
    } else {
      const msg = document.createElement('div');
      msg.textContent = 'Unsupported file type. Please upload an image or video.';
      msg.style.color = '#ef4444';
      previewMedia.appendChild(msg);
      return;
    }
    previewMedia.appendChild(node);
  }

  function onFile(file) {
    if (!file) return;
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert('File too large. Max 25 MB.');
      resetPreview();
      return;
    }
    fileMeta.textContent = `${file.name} • ${file.type || 'unknown'} • ${formatBytes(file.size)}`;
    renderPreview(file);
    appState.hasFile = true;
    appState.selectedFile = file;
    updateMintEnabled();
  }

  
  if (browseBtn) browseBtn.addEventListener('click', function() { fileInput.click(); });
  if (fileInput) fileInput.addEventListener('change', function(e) { onFile(e.target.files[0]); });

  
  ['dragenter','dragover'].forEach(function(evt) {
    dropzone.addEventListener(evt, function(e) { e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover'); });
  });
  ;['dragleave','drop'].forEach(function(evt) {
    dropzone.addEventListener(evt, function(e) { e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover'); });
  });
  dropzone.addEventListener('drop', function(e) {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files[0]) onFile(dt.files[0]);
  });

  
  dropzone.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });

  
  function collectMetadata() {
    return {
      title: (titleInput.value || '').trim(),
      creator: (creatorInput.value || '').trim(),
      description: (document.getElementById('descInput').value || '').trim(),
      editionSize: parseInt(editionInput.value || '1', 10) || 1,
      timestamp: new Date().toISOString()
    };
  }

  async function ensureEthers() {
    if (!window.ethereum) {
      alert('No Ethereum provider found. Please install MetaMask.');
      return false;
    }
    if (!window.ethers) {
      alert('Ethers not loaded');
      return false;
    }
    
    
    if (window.ethereum.isBybit) {
      console.log('Bybit wallet detected');
    }
    
    return true;
  }

  const evmNetworks = {
    ethereum: { chainIdHex: '0x1', params: { chainId: '0x1', chainName: 'Ethereum Mainnet', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://rpc.ankr.com/eth'], blockExplorerUrls: ['https://etherscan.io'] } },
    polygon: { chainIdHex: '0x89', params: { chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com'], blockExplorerUrls: ['https://polygonscan.com'] } },
    base: { chainIdHex: '0x2105', params: { chainId: '0x2105', chainName: 'Base', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://mainnet.base.org'], blockExplorerUrls: ['https://basescan.org'] } },
    sepolia: { chainIdHex: '0xAA36A7', params: { chainId: '0xAA36A7', chainName: 'Sepolia', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://rpc.sepolia.org'], blockExplorerUrls: ['https://sepolia.etherscan.io'] } },
    mumbai: { chainIdHex: '0x13881', params: { chainId: '0x13881', chainName: 'Mumbai', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://rpc-mumbai.maticvigil.com'], blockExplorerUrls: ['https://mumbai.polygonscan.com'] } },
    baseSepolia: { chainIdHex: '0x14A34', params: { chainId: '0x14A34', chainName: 'Base Sepolia', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://sepolia.base.org'], blockExplorerUrls: ['https://sepolia.basescan.org'] } }
  };

  async function addSepoliaNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [evmNetworks.sepolia.params]
      });
      console.log('Sepolia network added successfully');
      return true;
    } catch (error) {
      console.error('Failed to add Sepolia network:', error);
      return false;
    }
  }

  async function switchToSelectedChain() {
    if (!appState.network || appState.network === 'solana') {
      return false;
    }
    const net = evmNetworks[appState.network];
    if (!net) return false;
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: net.chainIdHex }] });
      return true;
    } catch (err) {
      if (err && err.code === 4902) {
        try {
          await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [net.params] });
          return true;
        } catch (addErr) {
          console.error(addErr);
          alert('Failed to add network to wallet');
          return false;
        }
      }
      console.error(err);
      alert('Failed to switch network');
      return false;
    }
  }

  function showWalletModal() {
    walletModal.style.display = 'flex';
  }

  function hideWalletModal() {
    walletModal.style.display = 'none';
  }

  async function connectToWallet(walletType) {
    hideWalletModal();
    
    try {
      let provider = null;
      let walletName = 'Unknown';
      
      switch (walletType) {
        case 'metamask':
          if (window.ethereum && window.ethereum.isMetaMask) {
            provider = window.ethereum;
            walletName = 'MetaMask';
          } else {
            const install = confirm(
              'MetaMask not found.\n\n' +
              'Would you like to install MetaMask?\n\n' +
              'Click OK to open MetaMask download page.'
            );
            if (install) {
              window.open('https://metamask.io/download/', '_blank');
            }
            return;
          }
          break;
          
        case 'bybit':
          if (window.ethereum && window.ethereum.isBybit) {
            provider = window.ethereum;
            walletName = 'Bybit';
          } else {
            const install = confirm(
              'Bybit Wallet not found.\n\n' +
              'Would you like to install Bybit Wallet?\n\n' +
              'Click OK to open Bybit Wallet download page.'
            );
            if (install) {
              window.open('https://www.bybit.com/web3/', '_blank');
            }
            return;
          }
          break;
          
        case 'coinbase':
          if (window.ethereum && window.ethereum.isCoinbaseWallet) {
            provider = window.ethereum;
            walletName = 'Coinbase';
          } else {
            alert('Coinbase Wallet not found. Please install Coinbase extension.');
            return;
          }
          break;
          
        case 'brave':
          if (window.ethereum && window.ethereum.isBraveWallet) {
            provider = window.ethereum;
            walletName = 'Brave';
          } else {
            alert('Brave Wallet not found. Please use Brave browser.');
            return;
          }
          break;
          
        case 'walletconnect':
          alert('WalletConnect integration coming soon!');
          return;
          
        case 'trust':
          if (window.ethereum && window.ethereum.isTrust) {
            provider = window.ethereum;
            walletName = 'Trust Wallet';
          } else {
            alert('Trust Wallet not found. Please install Trust Wallet extension.');
            return;
          }
          break;
          
        case 'rainbow':
          if (window.ethereum && window.ethereum.isRainbow) {
            provider = window.ethereum;
            walletName = 'Rainbow';
          } else {
            alert('Rainbow Wallet not found. Please install Rainbow extension.');
            return;
          }
          break;
          
        case 'phantom':
          if (window.solana && window.solana.isPhantom) {
            alert('Phantom (Solana) integration coming soon!');
            return;
          } else {
            alert('Phantom not found. Please install Phantom extension.');
            return;
          }
          break;
          
        case 'ledger':
          alert('Ledger hardware wallet integration coming soon!');
          return;
          
        case 'tally':
          if (window.ethereum && window.ethereum.isTally) {
            provider = window.ethereum;
            walletName = 'Tally';
          } else {
            alert('Tally Wallet not found. Please install Tally extension.');
            return;
          }
          break;
          
        case 'binance':
          if (window.ethereum && window.ethereum.isBinance) {
            provider = window.ethereum;
            walletName = 'Binance';
          } else {
            const install = confirm(
              'Binance Wallet not found.\n\n' +
              'Would you like to:\n' +
              '• Install Binance Wallet extension\n' +
              '• Try connecting with another wallet\n\n' +
              'Click OK to open Binance Wallet download page.'
            );
            if (install) {
              window.open('https://www.binance.org/en/web3wallet', '_blank');
            }
            return;
          }
          break;
          
        default:
          
          if (window.ethereum) {
            provider = window.ethereum;
            if (window.ethereum.isMetaMask) walletName = 'MetaMask';
            else if (window.ethereum.isBybit) walletName = 'Bybit';
            else if (window.ethereum.isCoinbaseWallet) walletName = 'Coinbase';
            else if (window.ethereum.isBraveWallet) walletName = 'Brave';
            else if (window.ethereum.isTrust) walletName = 'Trust Wallet';
            else if (window.ethereum.isRainbow) walletName = 'Rainbow';
            else if (window.ethereum.isTally) walletName = 'Tally';
            else if (window.ethereum.isBinance) walletName = 'Binance';
            else walletName = 'Ethereum Provider';
          } else {
            alert('No wallet found. Please install a supported wallet extension.');
            return;
          }
      }
      
      console.log('Connecting to:', walletName);
      
      
      const userConsent = confirm(
        `Connect to ${walletName}?\n\n` +
        'This will allow the app to:\n' +
        '• View your wallet address\n' +
        '• Check your balance\n' +
        '• Send transactions (with your approval)\n\n' +
        'No funds will be moved without your explicit consent.'
      );
      
      if (!userConsent) {
        console.log('User declined wallet connection');
        return;
      }
      
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      appState.provider = new window.ethers.BrowserProvider(provider);
      appState.signer = await appState.provider.getSigner();
      appState.walletConnected = accounts && accounts.length > 0;
      
      const addr = await appState.signer.getAddress();
      const short = addr.slice(0, 6) + '…' + addr.slice(-4);
      connectBtn.textContent = `${walletName}: ${short}`;
      connectBtn.classList.remove('btn-secondary');
      connectBtn.classList.add('btn-primary');
      appState.address = addr;
      updateMintEnabled();
      updateProfileUI();
      
      
      alert(`Successfully connected to ${walletName}!\nAddress: ${addr}`);
    } catch (e) {
      console.error(e);
      if (e.code === 4001) {
        alert('Connection rejected by user');
      } else {
        alert('Wallet connection failed: ' + (e.message || 'Unknown error'));
      }
    }
  }

  async function callContractMint(uri) {
    // Try to get contract address from contracts.js first, then fallback to input
    let address = '';
    
    // Check if contracts.js is loaded and has the address
    if (typeof getContractAddress === 'function') {
      address = getContractAddress('MomentERC721');
    }
    
    // Fallback to manual input if no address found
    if (!address) {
      address = (contractInput.value || '').trim();
      if (!address) { 
        alert('Please enter a contract address or deploy contracts first.'); 
        return; 
      }
    }
    const abi = [
      'function mintMoment(string title,string description,string creator,uint256 editionSize,string uri)',
      'function safeMint(address to,string tokenURI)'
    ];
    const contract = new window.ethers.Contract(address, abi, appState.signer);
    const data = collectMetadata();
    try {
      let tx;
      if (typeof contract.mintMoment === 'function') {
        tx = await contract.mintMoment(data.title, data.description, data.creator, data.editionSize, uri);
      } else if (typeof contract.safeMint === 'function') {
        const addr = await appState.signer.getAddress();
        tx = await contract.safeMint(addr, uri);
      } else {
        alert('Contract does not support expected mint functions.');
        return;
      }
      mintBtn.textContent = 'Minting…';
      mintBtn.disabled = true;
      navMintBtn.disabled = true;
      const receipt = await tx.wait();
      mintBtn.textContent = 'Mint this moment';
      alert('Minted! Tx: ' + (receipt && receipt.hash ? receipt.hash : tx.hash));
    } catch (err) {
      console.error(err);
      alert('Mint failed: ' + (err && err.message ? err.message : 'Unknown error'));
    } finally {
      updateMintEnabled();
    }
  }

  async function uploadToIPFS(file) {
    const token = (web3TokenInput.value || '').trim();
    if (!token) { throw new Error('Missing Web3.Storage API token'); }
    if (!window.Web3Storage) { throw new Error('Web3.Storage library not loaded'); }
    const client = new window.Web3Storage.Web3Storage({ token: token });
    const data = collectMetadata();
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const assetName = `asset.${ext || 'bin'}`;
    const files = [
      new File([file], assetName, { type: file.type || 'application/octet-stream' })
    ];
    
    const assetCid = await client.put(files, { wrapWithDirectory: false });
    const assetUri = `ipfs://${assetCid}`;
    const metadata = {
      name: data.title || 'Untitled Moment',
      description: data.description || 'Mint My Moment',
      image: isImage(file) ? assetUri : undefined,
      animation_url: isVideo(file) ? assetUri : undefined,
      attributes: [
        { trait_type: 'Creator', value: data.creator || 'Unknown' },
        { trait_type: 'Edition Size', value: data.editionSize },
        { trait_type: 'Minted At', value: data.timestamp }
      ].filter(Boolean)
    };
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
    const metaCid = await client.put([metadataFile], { wrapWithDirectory: false });
    return `ipfs://${metaCid}`;
  }

  async function performMint() {
    if (appState.network === 'solana') { alert('Solana not supported in this demo. Choose an EVM network.'); return; }
    if (!appState.walletConnected) { alert('Please connect a wallet first.'); return; }
    if (!appState.network) { alert('Please select a network.'); return; }
    if (!appState.hasFile) { alert('Please upload a file first.'); return; }
    const switched = await switchToSelectedChain();
    if (switched === false && appState.network !== '') { return; }
    const file = appState.selectedFile;
    let uri;
    try {
      uri = await uploadToIPFS(file);
    } catch (e) {
      console.error(e);
      alert('IPFS upload failed: ' + (e && e.message ? e.message : 'Unknown error'));
      return;
    }
    await callContractMint(uri);
  }

  if (mintBtn) {
    mintBtn.addEventListener('click', function(){ performMint(); });
  } else {
    console.error('mintBtn not found, cannot add event listener');
  }
  
  if (navMintBtn) {
    navMintBtn.addEventListener('click', function(){ 
      console.log('Nav mint button clicked');
      console.log('App state:', appState);
      performMint(); 
    });
  } else {
    console.error('navMintBtn not found, cannot add event listener');
  }

  
  
  if (connectBtn) {
    connectBtn.addEventListener('click', function() { 
      if (!appState.walletConnected) { 
        showWalletModal(); 
      } else { 
        appState.walletConnected = false; 
        connectBtn.textContent = 'Connect Wallet'; 
        connectBtn.classList.add('btn-secondary'); 
        connectBtn.classList.remove('btn-primary'); 
        appState.address = '';
        updateMintEnabled(); 
        updateProfileUI();
      } 
    });
  } else {
    console.error('connectBtn not found, cannot add event listener');
  }

  
  closeModal.addEventListener('click', hideWalletModal);

  
  walletModal.addEventListener('click', function(e) {
    if (e.target === walletModal) {
      hideWalletModal();
    }
  });

  
  document.querySelectorAll('.wallet-option').forEach(button => {
    button.addEventListener('click', function() {
      const walletType = this.getAttribute('data-wallet');
      connectToWallet(walletType);
    });
  });

  
  networkSelect.addEventListener('change', function(e) {
    appState.network = e.target.value || '';
    updateMintEnabled();
    updateProfileUI();
    
    // Auto-fill contract address if available
    if (typeof getContractAddress === 'function') {
      const contractAddr = getContractAddress('MomentERC721');
      if (contractAddr && contractInput) {
        contractInput.value = contractAddr;
        contractInput.placeholder = `Using deployed contract: ${contractAddr.slice(0, 10)}...`;
      }
    }
  });

  window.addEventListener('hashchange', function(){ showPage(location.hash); });
  showPage(location.hash);

  if (navLogin) navLogin.addEventListener('click', function(){ showPage('#login'); });
  if (navProfile) navProfile.addEventListener('click', function(){ showPage('#profile'); });

  if (addSepoliaBtn) addSepoliaBtn.addEventListener('click', async function(){
    if (!window.ethereum) {
      alert('Please install MetaMask first');
      return;
    }
    const success = await addSepoliaNetwork();
    if (success) {
      alert('Sepolia network added to MetaMask! You can now select it from the network dropdown.');
    } else {
      alert('Failed to add Sepolia network. You may need to add it manually in MetaMask settings.');
    }
  });

  // Login and profile event listeners removed

  // Mobile Menu Toggle Functionality
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      // Toggle active classes
      mobileMenuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Nav links removed - menu will close on outside click or manual toggle
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuBtn.contains(event.target) && !navMenu.contains(event.target)) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu on window resize if desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  } catch (error) {
    console.error('JavaScript error in Mint My Moment:', error);
    console.error('Error stack:', error.stack);
  }
})();


