import { ethers } from "hardhat";
const contractAddress = process.env.ERC1155!;
async function safeTransferFrom(from: string, to: string, id: Array<number>, amount: Array<number>) {
    console.log('transfer from ERC1155 contract')

    const Erc1155 = await ethers.getContractFactory("MyERC1155");
    const erc1155 = await Erc1155.attach(contractAddress);
    const transfer = await erc1155.safeBatchTransferFrom(from, to, id , amount, "0x");

    console.log('transfer :', transfer);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const ids = [0,1,2];
const amounts = [1, 2, 3];
safeTransferFrom(process.env.PUBLIC_KEY!, process.env.PUBLIC_KEY_2!, ids, amounts).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
