import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const initialSupply = ethers.utils.parseUnits("1000000", 18); // 1M MOCK

    const res = await deploy("MockERC20", {
        from: deployer,
        args: ["Mock DAI", "MOCK", initialSupply],
        log: true,
        skipIfAlreadyDeployed: true, // idempotente: si ya existe, no redeploy
    });

    log(`MockERC20 deployed at: ${res.address}`);
};

export default func;
func.tags = ["core", "token"];