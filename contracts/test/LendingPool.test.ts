import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import type { MockERC20 } from "../typechain-types/contracts/MockERC20";
import type { LendingPool } from "../typechain-types/contracts/LendingPool";


describe("LendingPool", function () {
    const NAME = "Mock DAI";
    const SYMBOL = "mDAI";
    const SUPPLY = ethers.utils.parseEther("1000000");


    let token: MockERC20;
    let pool: LendingPool;
    let deployer: any, user1: any, user2: any;


    beforeEach(async function () {
        [deployer, user1, user2] = await ethers.getSigners();


        // Despliega MockERC20 con supply inicial
        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        token = (await MockERC20Factory.deploy(NAME, SYMBOL, SUPPLY)) as MockERC20;
        await token.deployed();


        // Transfiere tokens a user1 y user2 para testear
        await token.transfer(user1.address, ethers.utils.parseEther("1000"));
        await token.transfer(user2.address, ethers.utils.parseEther("1000"));


        // Despliega LendingPool apuntando al token
        const LendingPoolFactory = await ethers.getContractFactory("LendingPool");
        pool = (await LendingPoolFactory.deploy(token.address)) as LendingPool;
        await pool.deployed();
    });


    // ✅ Test 1: Permite depositar tokens correctamente
    // Esencial para que los usuarios aporten liquidez al pool
    it("debería permitir que un usuario deposite tokens", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("100"));
        await expect(pool.connect(user1).deposit(ethers.utils.parseEther("100")))
            .to.emit(pool, "Deposit") // Chequea el evento Deposit
            .withArgs(user1.address, ethers.utils.parseEther("100"));


        const deposito = await pool.deposits(user1.address);
        expect(deposito).to.equal(ethers.utils.parseEther("100"));
    });

    // ❌ Test 2: Evita depositar 0 tokens
    // Previene acciones inútiles o potenciales exploits
    it("no debería permitir depositar 0 tokens", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("100"));
        await expect(pool.connect(user1).deposit(0)).to.be.revertedWith("Deposit amount must be > 0");
    });


    // ❌ Test 3: Evita depositar sin allowance suficiente
    // Protege contra intentos de transferencias no aprobadas
    it("no debería permitir depositar sin allowance suficiente", async function () {
        // No aprobamos nada antes de depositar
        await expect(
            pool.connect(user1).deposit(ethers.utils.parseEther("50"))
        ).to.be.reverted;
    });


    // ✅ Test 4: Permite pedir prestado hasta el límite permitido
    // Core de la función borrow: pedir tokens contra el colateral aportado
    it("debería permitir pedir prestado hasta el límite permitido", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("200"));
        await pool.connect(user1).deposit(ethers.utils.parseEther("200"));


        await expect(pool.connect(user1).borrow(ethers.utils.parseEther("100")))
            .to.emit(pool, "Borrow") // Chequea el evento Borrow
            .withArgs(user1.address, ethers.utils.parseEther("100"));


        const deuda = await pool.borrows(user1.address);
        expect(deuda).to.equal(ethers.utils.parseEther("100"));
    });


    // ❌ Test 5: Evita pedir prestado 0 tokens
    // Evita interacciones sin sentido con el pool
    it("no debería permitir pedir prestado 0 tokens", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("200"));
        await pool.connect(user1).deposit(ethers.utils.parseEther("200"));
        await expect(pool.connect(user1).borrow(0)).to.be.revertedWith("Borrow amount must be > 0");
    });


    // ❌ Test 6: Evita pedir más prestado de lo depositado
    // Garantiza que los préstamos no superen el colateral
    it("no debería permitir pedir prestado más de lo depositado", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("200"));
        await pool.connect(user1).deposit(ethers.utils.parseEther("200"));
        await expect(pool.connect(user1).borrow(ethers.utils.parseEther("201"))).to.be.revertedWith("Borrow limit exceeded");
    });


    // ❌ Test 7: Evita pedir prestado si no hay liquidez en el pool
    // Previene que el contrato intente transferir tokens inexistentes
    // it("no debería permitir pedir prestado si el pool no tiene liquidez suficiente", async function () {
    //   // user1 deposita y user2 vacía el pool
    //   await token.connect(user1).approve(pool.address, ethers.utils.parseEther("200"));
    //   await pool.connect(user1).deposit(ethers.utils.parseEther("200"));

    //   await token.connect(user2).approve(pool.address, ethers.utils.parseEther("900"));
    //   await pool.connect(user2).deposit(ethers.utils.parseEther("900"));
    //   await pool.connect(user2).borrow(ethers.utils.parseEther("900"));

    //   await expect(pool.connect(user1).borrow(ethers.utils.parseEther("200"))).to.be.revertedWith("Not enough liquidity in pool");
    // });


    // ✅ Test 8: Calcula el health factor correctamente cuando no hay deuda
    // Debe devolver uint256.max si el usuario no tiene deuda
    it("debería retornar salud infinita si no hay deuda", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("50"));
        await pool.connect(user1).deposit(ethers.utils.parseEther("50"));
        const health = await pool.getHealthFactor(user1.address);
        expect(health).to.equal(ethers.constants.MaxUint256);
    });


    // ✅ Test 9: Calcula el health factor después de pedir prestado
    // Ratio correcto: deposit / borrow * 100
    it("debería calcular correctamente el health factor tras depositar y pedir prestado", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("100"));
        await pool.connect(user1).deposit(ethers.utils.parseEther("100"));
        await pool.connect(user1).borrow(ethers.utils.parseEther("25"));
        const health = await pool.getHealthFactor(user1.address);
        expect(health).to.equal(400); // 100*100/25 = 400
    });


    // ✅ Test 10: El health factor se actualiza al pedir más deuda
    // Prueba que la lógica se mantiene después de sucesivas operaciones
    it("debería actualizar el health factor tras nuevos préstamos", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("200"));
        await pool.connect(user1).deposit(ethers.utils.parseEther("200"));
        await pool.connect(user1).borrow(ethers.utils.parseEther("100"));
        let health = await pool.getHealthFactor(user1.address);
        expect(health).to.equal(200); // 200*100/100


        await pool.connect(user1).borrow(ethers.utils.parseEther("50"));
        health = await pool.getHealthFactor(user1.address);
        expect(health).to.equal(133); // 200*100/150
    });


    // ✅ Test 11: Maneja múltiples usuarios correctamente
    // Verifica que los saldos y deudas no se mezclan entre usuarios
    it("debería manejar depósitos y préstamos de múltiples usuarios sin mezclarlos", async function () {
        await token.connect(user1).approve(pool.address, ethers.utils.parseEther("100"));
        await token.connect(user2).approve(pool.address, ethers.utils.parseEther("200"));
        await pool.connect(user1).deposit(ethers.utils.parseEther("100"));
        await pool.connect(user2).deposit(ethers.utils.parseEther("200"));


        await pool.connect(user2).borrow(ethers.utils.parseEther("50"));


        expect(await pool.deposits(user1.address)).to.equal(ethers.utils.parseEther("100"));
        expect(await pool.borrows(user1.address)).to.equal(0);
        expect(await pool.deposits(user2.address)).to.equal(ethers.utils.parseEther("200"));
        expect(await pool.borrows(user2.address)).to.equal(ethers.utils.parseEther("50"));
    });


    // ❌ Test 12: Evita overflows/underflows con montos grandes
    // Prueba que no se rompa con valores extremos (aunque Solidity >=0.8 previene esto)
    it("no debería permitir depósitos o préstamos que causen overflow", async function () {
        await token.connect(user1).approve(pool.address, ethers.constants.MaxUint256);
        // Intentar depositar un monto ridículamente grande
        await expect(pool.connect(user1).deposit(ethers.constants.MaxUint256)).to.be.reverted;
    });


    // ❌ Test 13: Evita pedir prestado si nunca depositaste
    // La función debe proteger usuarios sin colateral
    it("no debería permitir pedir prestado si el usuario nunca depositó", async function () {
        await expect(pool.connect(user1).borrow(ethers.utils.parseEther("10"))).to.be.revertedWith("Borrow limit exceeded");
    });
});