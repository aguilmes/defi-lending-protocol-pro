import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,      // or whatever chainId your node uses
    },
    sepolia: {
      url: RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  typechain: { outDir: "typechain-types", target: "ethers-v5" },
  solidity: "0.8.28",
  // si ya tienes typechain en config no hace falta repetirlo,
  // pero podrías añadir:
  // typechain: { outDir: "typechain-types", target: "ethers-v5" },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }  
};


export default config;