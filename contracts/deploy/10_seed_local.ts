import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers } from 'hardhat';

const DESIRED_AMOUNT = process.env.SEED_MOCK_AMOUNT ?? '1000';
const TO_ENV = process.env.SEED_TO;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { log, get } = deployments;
    const { user1 } = await getNamedAccounts();
    // Si SEED_TO está vacío, o con espacios, usa user1
    const to = (TO_ENV && TO_ENV.trim()) ? TO_ENV : user1;
    if (!ethers.utils.isAddress(to)) {
        throw new Error(`SEED_TO inválida: "${to}"`);
    }

    const tokenDep = await get('MockERC20');
    const token = await ethers.getContractAt('MockERC20', tokenDep.address);

    const decimals: number = await token.decimals();
    const desired = ethers.utils.parseUnits(DESIRED_AMOUNT, decimals);

    const current = await token.balanceOf(to);

    if (current.gte(desired)) {
        log(`Seed skip: ${to} ya tiene >= ${DESIRED_AMOUNT} MOCK (${current.toString()})`);
        return;
    }

    const topUp = desired.sub(current);
    const tx = await token.transfer(to, topUp);
    await tx.wait();

    log(`Seed OK: +${topUp.toString()} MOCK -> ${to}`);
};

export default func;
func.tags = ['seed'];
func.dependencies = ['token'];