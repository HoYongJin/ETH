import { ethers } from "hardhat";

// 블록체인 작업(배포, 서명, 대기)은 네트워크 응답을 기다려야 하므로 시간이 걸림
// 따라서 await 키워드를 사용하기 위해 함수를 async로 정의
async function main() {
    console.log("deploying vendingMachine contract");
    
    const VendingMachine = await ethers.getContractFactory("VendingMachine");   // 스마트 컨트랙트의 공장(Factory) 객체를 가져옴
    const vendingMachine = await VendingMachine.deploy();   // 컨트랙트 배포 트랜잭션을 전송(이 시점에서 생성자 constructor가 실행)

    await vendingMachine.deployed();    // 전송한 배포 트랜잭션이 블록에 포함되어 최종적으로 완료될 때까지 대기

    console.log(`vendingMachine contract is deployed to ${vendingMachine.address}`);
}   

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});