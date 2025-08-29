// scripts/deploy-mock-token.ts

import { ethers } from "hardhat";

// Parámetros configurables del token
const NAME = "Mock DAI";
const SYMBOL = "mDAI";
const SUPPLY = ethers.utils.parseEther("1000000"); // 1 millón de tokens

async function main() {
  console.log("🚀 Deploying MockERC20...");

  // Obtiene la factory del contrato
  const MockERC20 = await ethers.getContractFactory("MockERC20");

  // Despliega el contrato
  const mockToken = await MockERC20.deploy(NAME, SYMBOL, SUPPLY);
  await mockToken.deployed();

  // Dirección del contrato
  console.log(`✅ MockERC20 deployed!`);
  console.log(`   Name:    ${NAME}`);
  console.log(`   Symbol:  ${SYMBOL}`);
  console.log(`   Supply:  ${ethers.utils.formatEther(SUPPLY)}`);
  console.log(`   Address: ${mockToken.address}`);

  // Opcional: guardar en un archivo la address para usar en otros scripts
  // import fs from "fs";
  // fs.writeFileSync("deployed-mockerc20.txt", mockToken.address);
}

// Manejo de errores global
main().catch((error) => {
  console.error("❌ Error deploying MockERC20:", error);
  process.exitCode = 1;
});