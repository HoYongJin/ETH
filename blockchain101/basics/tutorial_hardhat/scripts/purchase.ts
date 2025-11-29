import { ethers } from "hardhat";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function purchase(amount: number) {
    console.log("purchase from vendingMachine contract");

    const VendingMachine = await ethers.getContractFactory("VendingMachine");
    // 위에서 만든 정의(VendingMachine)와 실제 주소(contractAddress)를 결합하여 컨트랙트 인스턴스를 생성
    // contractAddress는 vendingMachine 이라는 선언
    // vendingMachine 변수를 통해 해당 주소의 함수들을 자바스크립트 함수처럼 호출할 수 있게 연결(Attach)
    const vendingMachine = await VendingMachine.attach(contractAddress);

    // 연결된 컨트랙트의 purchase 함수를 실행(트랜잭션 전송)
    // toString(): 큰 숫자가 자바스크립트에서 깨지는 것을 막기 위해 문자열로 변환하여 전달
    const purchase = await vendingMachine.purchase(amount, {value: (amount*(10**18)).toString()});

    console.log(`purchase: `, purchase);
}
purchase​​(1).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});