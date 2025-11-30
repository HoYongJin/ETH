import { ethers } from "hardhat";
const contractAddress = process.env.ERC20!;

async function transferEvent() {
    const MyERC20 = await ethers.getContractFactory("MyERC20");
    const erc20 = await MyERC20.attach(contractAddress);
    
    const filterTopic = erc20.filters.Transfer().topics![0];

    const filter = {
        address: contractAddress.toString(),
        fromBlock: 0,
        toBlock: 'latest',
        topics: [filterTopic]
    };

    const logs = await ethers.provider.getLogs(filter);
    console.log(`Found ${logs.length} events.`);

    let abi = require("../artifacts/contracts/MyERC20.sol/MyERC20.json").abi;
    let iface = new ethers.utils.Interface(abi);
  
    logs.forEach(async(log) => {
        try {
            const parsedLog = iface.parseLog(log);

            console.log(`-----------------------------------`);
            console.log(`Tx Hash: ${log.transactionHash}`);
            console.log(`Block: ${log.blockNumber}`);
            console.log("From  >>", parsedLog.args.from);
            console.log("To    >>", parsedLog.args.to);
            console.log("Value >>", ethers.utils.formatEther(parsedLog.args.value.toString())); 
        } catch (e) {
            console.error("Log parsing error:", e);
        }
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
transferEvent().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
