import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai";
import { ethers } from "hardhat";

// 테스트 그룹을 정의합니다. 여기서는 VendingMachine 컨트랙트와 관련된 모든 테스트를 묶음
describe("VendingMachine", function() {
    // 테스트 환경을 초기화하는 Fixture 함수를 정의(컨트랙트를 배포하고 초기 설정을 수행하는 로직)
    async function VendingMachineFixture() {
        // 첫 번째 계정을 owner(배포자/주인), 두 번째 계정을 otherAccount(일반 사용자)로 할당
        const[owner, otherAccount] = await ethers.getSigners();     // Hardhat 네트워크에서 사용할 수 있는 테스트 계정(Signer)들의 배열을 가져옴
        const VendingMachine = await ethers.getContractFactory("VendingMachine");   // 스마트 컨트랙트의 공장(Factory) 객체를 가져옴
        const vendingMachine = await VendingMachine.deploy();       // 컨트랙트 배포 트랜잭션을 전송(이 시점에서 생성자 constructor가 실행)

        return { vendingMachine, owner, otherAccount };
    }

    // 중첩된 describe 블록
    describe("VendingMachine1", function() {
        // 1. 테스트 케이스
        it("1. should make 100 cupcake at constructor", async function() {
            // 앞서 정의한 VendingMachineFixture 함수를 실행
            // 최초 실행 시: 컨트랙트를 배포하고 결과를 반환
            // 이후 실행 시: 배포 과정을 생략하고 저장된 스냅샷(초기 상태)으로 네트워크를 되돌린 후 결과를 반환합
            const {vendingMachine} = await loadFixture(VendingMachineFixture);  // 반환된 객체에서 vendingMachine 컨트랙트 인스턴스만 추출

            // 컨트랙트의 cupcakeBalances 매핑(Mapping)을 조회(인자로 컨트랙트 자신의 주소(vendingMachine.address) 전달)
            // .toNumber(): 반환된 값은 BigNumber 타입 --> 자바스크립트 숫자(number) 타입으로 변환
            expect((await vendingMachine.cupcakeBalances(vendingMachine.address)).toNumber()).to.equal(100);
        });
        
        // 2. 테스트 케이스
        it("2. should send cupcakes correctly after purchase", async function() {
            // Fixture를 로드하여 초기화된 상태의 컨트랙트와 계정들을 가져옴(vendingMachine 잔고는 다시 100개인 상태 - 초기상태)
            const {vendingMachine, owner, otherAccount} = await loadFixture(VendingMachineFixture);

            // 디버깅용 로그: 구매 전 자판기의 컵케이크 잔고를 출력
            console.log("vendingMachine cupcakeBalance: ", await vendingMachine.cupcakeBalances(vendingMachine.address));

            // 구매 전 otherAccount의 컵케이크 잔고를 조회
            // 디버깅용 로그: 구매 전 otherAccount의 컵케이크 잔고를 출력
            const accountTwoStartingBalance = (await vendingMachine.cupcakeBalances(otherAccount.address)).toNumber();
            console.log("accountTwoStartingBalance cupcakeBalance: ", accountTwoStartingBalance);

            // connect(otherAccount): owner가 호출하는 것으로 설정된 컨트랙트 인스턴스를, otherAccount가 호출하는 것으로 연결을 변경
            // purchase(amount, { value: ... }): purchase 함수를 호출
            // { value: ... }: 트랜잭션과 함께 보낼 이더(ETH) 양을 설정
            // expect(...).to.emit(...): 이 트랜잭션이 Purchase라는 이벤트(Event)를 발생시키는지 검증
            // withArgs(otherAccount.address, amount): 발생한 이벤트의 인자가 otherAccount.address (구매자)와 amount (10개)인지 검증
            const amount = 10;
            await expect(vendingMachine.connect(otherAccount).purchase(amount, {value: (amount*10**18).toString() }))
            .to.emit(vendingMachine, "Purchase")
            .withArgs(otherAccount.address, amount)

            // 구매 후 otherAccount의 컵케이크 잔고를 다시 조회하여 accountTwoEndingBalance에 저장
            // 디버깅용 로그: 구매 후 자판기 잔고 출력
            const accountTwoEndingBalance = (await vendingMachine.cupcakeBalances(otherAccount.address)).toNumber();
            console.log("accountTwoEndingBalance cupcakeBalance: ", accountTwoEndingBalance);
            console.log("vendingMachine cupcakeBalance: ", await vendingMachine.cupcakeBalances(vendingMachine.address));

            // 검증: (구매 후 잔고)가 (구매 전 잔고 + 구매량)과 같은지 확인
            expect(accountTwoEndingBalance).to.equal(
                accountTwoStartingBalance+amount
            );
        });

        // 3. 테스트 케이스
        it("3. should refill cupcakes correctly", async function() {
            // Fixture를 로드하여 다시 초기 상태(100개)로 돌아감
            const {vendingMachine, owner, otherAccount} = await loadFixture(VendingMachineFixture);

            // vendingMachine.refill(amount): owner 계정으로 refill 함수를 호출(owner가 아닌 계정으로 호출하면 실패)
            const amount : number = 10;
            await vendingMachine.refill(amount);

            // 검증: 자판기의 컵케이크 잔고(cupcakeBalances[address(this)])가 초기값 100개에 리필한 10개를 더한 110개가 되었는지 확인
            console.log("vendingMachine cupcakeBalances: ", await vendingMachine.cupcakeBalances(vendingMachine.address));
            expect((await vendingMachine.cupcakeBalances(vendingMachine.address)).toNumber()).to.equal(110);
        });
    
    })
})