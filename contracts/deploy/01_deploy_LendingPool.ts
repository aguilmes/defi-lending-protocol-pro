import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();

    // 1) Tomamos la address del token del deploy anterior
    const tokenDep = await get('MockERC20'); // viene de 00_deploy_MockERC20
    const tokenAddress = tokenDep.address;

    // 2) Deploy idempotente del pool con el token como argumento
    const res = await deploy('LendingPool', {
        from: deployer,
        args: [tokenAddress], // constructor(address _token)
        log: true,
        skipIfAlreadyDeployed: true,
    });

    log(`LendingPool deployed at: ${res.address}`);
};

export default func;
func.tags = ["core", "pool"];
func.dependencies = ['token']; // asegura que MockERC20 esté antes