import { ethers } from "hardhat";

async function main() {
    console.log('deploying GameItem contract');

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();

    console.log(`GameItem contract is deployed to ${gameItem.address}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});