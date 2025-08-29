import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MockERC20 } from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers";


describe("MockERC20", function () {
    const NAME = "Mock DAI";
    const SYMBOL = "mDAI";
    const SUPPLY = ethers.utils.parseEther("1000");

    let deployer: any, user1: any, user2: any;
    let token: any;

    beforeEach(async function () {
        [deployer, user1, user2] = await ethers.getSigners();
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        token = await MockERC20.deploy(NAME, SYMBOL, SUPPLY);
        await token.deployed();
    });

    // ✅ Test 1: Verifica que el nombre y símbolo del token sean correctos
    // Esto valida que los parámetros del constructor se setean correctamente
    it("debería tener el nombre y símbolo correctos", async function () {
        expect(await token.name()).to.equal(NAME);
        expect(await token.symbol()).to.equal(SYMBOL);
    });

    // ✅ Test 2: Verifica que el deployer reciba todo el supply inicial
    // Fundamental para que el deployer pueda distribuir tokens en tests posteriores
    it("debería asignar el total del supply inicial al deployer", async function () {
        const balance = await token.balanceOf(deployer.address);
        expect(balance).to.equal(SUPPLY);
    });

    // ✅ Test 3: Permite transferencias entre cuentas
    // Este es el uso más básico y esencial de cualquier token ERC20
    it("debería permitir transferencias entre cuentas", async function () {
        await token.transfer(user1.address, ethers.utils.parseEther("100"));
        const balance = await token.balanceOf(user1.address);
        expect(balance).to.equal(ethers.utils.parseEther("100"));
    });

    // ✅ Test 4: Verifica que el evento Transfer sea emitido correctamente
    // Los eventos son cruciales para que los frontends detecten transferencias
    it("debería emitir un evento Transfer", async function () {
        await expect(token.transfer(user1.address, ethers.utils.parseEther("50")))
            .to.emit(token, "Transfer")
            .withArgs(deployer.address, user1.address, ethers.utils.parseEther("50"));
    });

    // ✅ Test 5: Permite aprobar un spender con cierto monto
    // Esto es necesario para el uso de transferencias delegadas (como en protocolos DeFi)
    it("debería permitir aprobar un spender", async function () {
        await token.approve(user1.address, ethers.utils.parseEther("200"));
        const allowance = await token.allowance(deployer.address, user1.address);
        expect(allowance).to.equal(ethers.utils.parseEther("200"));
    });

    // ✅ Test 6: Permite transferencias delegadas via transferFrom
    // Usado cuando una dApp o contrato quiere mover tokens en nombre del usuario
    it("debería permitir transferencias via transferFrom", async function () {
        await token.approve(user1.address, ethers.utils.parseEther("300"));
        await token.connect(user1).transferFrom(deployer.address, user2.address, ethers.utils.parseEther("100"));
        const balance = await token.balanceOf(user2.address);
        expect(balance).to.equal(ethers.utils.parseEther("100"));
    });

    // ✅ Test 7: Verifica que el evento Approval sea emitido correctamente
    // Importante para interfaces y seguimiento de aprobaciones en frontends
    it("debería emitir un evento Approval", async function () {
        await expect(token.approve(user1.address, ethers.utils.parseEther("100")))
            .to.emit(token, "Approval")
            .withArgs(deployer.address, user1.address, ethers.utils.parseEther("100"));
    });

    // ❌ Test 8: Evita transferencias por encima del balance disponible
    // Previene errores y exploits por desbordes o balances inconsistentes
    it("no debería permitir transferencias mayores al balance", async function () {
        const deployerBalance = await token.balanceOf(deployer.address);
        const amount = deployerBalance + BigInt(1);

        await expect(token.transfer(user1.address, amount)).to.be.reverted;
    });

    // ❌ Test 9: Evita transferFrom sin aprobación previa
    // Asegura que ningún tercero pueda mover fondos sin permiso explícito
    it("no debería permitir transferFrom sin aprobación previa", async function () {
        await expect(
            token.connect(user1).transferFrom(deployer.address, user2.address, ethers.utils.parseEther("10"))
        ).to.be.reverted;
    });

    // ❌ Test 10: Evita transferencias mayores al allowance aprobado
    // Protege el límite de gasto delegado que el usuario quiso establecer
    it("no debería permitir transferFrom por más del allowance", async function () {
        await token.approve(user1.address, ethers.utils.parseEther("50"));

        await expect(
            token.connect(user1).transferFrom(deployer.address, user2.address, ethers.utils.parseEther("60"))
        ).to.be.reverted;
    });
});