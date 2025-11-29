import { ethers } from "hardhat";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// async function purchase(amount: number) {
//   const VendingMachine = await ethers.getContractFactory("VendingMachine");
//   const vendingMachine = await VendingMachine.attach(contractAddress);
//   const topic = [vendingMachine.filters.Purchase().topics!].toString();
//   const filter = {
//     address: contractAddress.toString(),
//     fromBlock: 0,
//     toBlock: 10000000,
//     topics: [topic]    
//   };
//   const logs = await ethers.provider.getLogs(filter);
//   //특정 이벤트만 필터링 하기 위한 로그 값
//   // console.log("logs >>>", logs)
//   let abi = require("../artifacts/contracts/VendigMachine.sol/VendingMachine.json").abi;
//   let iface = new ethers.utils.Interface(abi);
//   //로그를 분석하기 위해서 abi를 가져옴
//   logs.forEach(async(logs) => {
//     //실제로 이벤트 로그 내용을 분석하기 위해서는 각각의 트랜잭션 receipt를 가져와서 처리해야 한다.
//     const receipt = await ethers.provider.getTransactionReceipt(logs.transactionHash);
//     // console.log("receipt >>>", receipt);
//     //반복문을 통해서 각로그들의 내용 출력 진행
//     receipt.logs.forEach((log) => {
//       // console.log("iface.parseLog(log) >>", iface.parseLog(log));
//       console.log("purchaser >>",iface.parseLog(log).args[0]);
//       console.log("amount >>",iface.parseLog(log).args[1]);
//     });
//   })
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// purchase(10).catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

async function checkEventLog() {
    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    const vendingMachine = await VendingMachine.attach(contractAddress);

    // Purchase 이벤트의 토픽(Topic) 해시를 추출
    // Topic(Signature): keccak256("Purchase(address,uint256")
    const filterTopic = vendingMachine.filters.Purchase().topics![0];

    // getLogs 함수에 전달할 필터 객체를 정의
    const filter = {
        address: contractAddress.toString(),    // 어느 컨트랙트의 로그를 볼 것인가
        fromBlock: 0,                           // 0번 블록부터
        toBlock: 'latest',                      // 가장 최근 블록까지
        topics: [filterTopic]                         // 위에서 추출한 Purchase 이벤트 토픽을 조건으로 사용
    };

    // 정의한 필터를 사용하여 블록체인 노드(Provider)에게 로그 데이터를 요청
    // logs 배열에는 암호화된(16진수 Hex) 형태의 원본 로그 데이터들이 담김
    const logs = await ethers.provider.getLogs(filter);
    console.log(`Found ${logs.length} logs.`);

    // 컴파일된 아티팩트 파일에서 ABI(Application Binary Interface) 정보를 직접 추출
    let abi = require("../artifacts/contracts/VendigMachine.sol/VendingMachine.json").abi;

    // 가져온 ABI를 사용하여 Interface 객체를 생성
    // 암호화된 로그 데이터를 ABI 정보를 바탕으로 사람이 읽을 수 있는 값(주소, 숫자 등)으로 해독(Decoding/Parsing)해주는 번역기 역할
    let iface = new ethers.utils.Interface(abi);

    logs.forEach((log) => {
        const parsedLog = iface.parseLog(log);  // Hex 데이터를 사람이 읽을 수 있는 형태로 파싱

        console.log("-------------------------------------------");
        console.log(`Block Number: ${log.blockNumber}`);
        console.log(`Tx hash: ${log.transactionHash}`)
        console.log(`Purchase: ${parsedLog.args.purchaser}`);
        console.log(`Amount: ${parsedLog.args.amount.toString()}`);
    });
}
checkEventLog().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});