const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  
  // Check if deployer exists
  if (!deployer) {
    console.error("❌ No deployer account found!");
    console.log("💡 Make sure you have:");
    console.log("   1. Set PRIVATE_KEY in .env file");
    console.log("   2. Or use Remix IDE for easier deployment");
    console.log("   3. Or run: npm run node (for local deployment)");
    process.exit(1);
  }
  
  console.log("Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy MomentERC721 contract
  console.log("\n📄 Deploying MomentERC721...");
  const MomentERC721 = await hre.ethers.getContractFactory("MomentERC721");
  const momentERC721 = await MomentERC721.deploy();
  await momentERC721.waitForDeployment();
  const momentERC721Address = await momentERC721.getAddress();
  console.log("✅ MomentERC721 deployed to:", momentERC721Address);

  // Deploy MintMyMoment contract
  console.log("\n🎨 Deploying MintMyMoment...");
  const MintMyMoment = await hre.ethers.getContractFactory("MintMyMoment");
  const mintMyMoment = await MintMyMoment.deploy();
  await mintMyMoment.waitForDeployment();
  const mintMyMomentAddress = await mintMyMoment.getAddress();
  console.log("✅ MintMyMoment deployed to:", mintMyMomentAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      MomentERC721: {
        address: momentERC721Address,
        name: "MomentERC721",
        symbol: "MMM"
      },
      MintMyMoment: {
        address: mintMyMomentAddress,
        name: "MintMyMoment"
      }
    }
  };

  // Write to file
  const fs = require('fs');
  const filename = `deployments/${hre.network.name}-${Date.now()}.json`;
  fs.mkdirSync('deployments', { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📝 Deployment info saved to:", filename);

  // Also save latest deployment
  fs.writeFileSync('deployments/latest.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("📝 Latest deployment saved to: deployments/latest.json");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("MomentERC721:", momentERC721Address);
  console.log("MintMyMoment:", mintMyMomentAddress);

  // Verify contracts if on testnet
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: momentERC721Address,
        constructorArguments: [],
      });
      console.log("✅ MomentERC721 verified");
    } catch (error) {
      console.log("❌ MomentERC721 verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: mintMyMomentAddress,
        constructorArguments: [],
      });
      console.log("✅ MintMyMoment verified");
    } catch (error) {
      console.log("❌ MintMyMoment verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });