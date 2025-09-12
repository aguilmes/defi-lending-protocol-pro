import { ethers } from "hardhat";

async function main() {
  // Dirección del token mock que ya desplegaste (reemplazá con la que corresponda)
  const mockTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Desplegá LendingPool apuntando al MockERC20
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(mockTokenAddress);

  await lendingPool.deployed();
  console.log(`LendingPool desplegado en: ${lendingPool.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});