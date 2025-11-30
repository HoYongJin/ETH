/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
// import chai from 'chai';
// import { solidity } from 'ethereum-waffle';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

// chai.use(solidity);

const name = 'MyToken';
const symbol = 'MT';
const decimals = 18;

// 일반 숫자(Number)를 블록체인에서 사용하는 **BigNumber(Wei 단위)**로 변환하는 도우미 함수
function changeToBigInt(amount: number) {
    const answerBigint = ethers.utils.parseUnits(amount.toString(), decimals);
    return answerBigint;
}

// describe('Start Example ERC20 test', async () => {
//   // contracts
//   let exampleERC20: Contract;
//   //signers
//   let owner: SignerWithAddress;
//   let addr1: SignerWithAddress;
//   let addr2: SignerWithAddress;
//   let amount: number;

//   it('Set data for exampleERC20 test', async () => {
//     amount = 100;
//     [owner, addr1, addr2] = await ethers.getSigners(); // get a test address
//   });

//   describe('Test Example ERC20 Metadata', () => {
//     it('Should get correct name, symbol, decimal for the Example ERC20 Contract', async () => {
//       const ExampleERC20Factory = await ethers.getContractFactory('MyERC20');
//       exampleERC20 = await ExampleERC20Factory.deploy();
//       await exampleERC20.deployed();
//       expect(await exampleERC20.name()).to.equal(name);
//       expect(await exampleERC20.symbol()).to.equal(symbol);
//       expect(await exampleERC20.decimals()).to.equal(decimals);
//     });
//   });

//   describe('Test Transfer exampleERC20', () => {
//     it('Should get correct MetaData for the Example ERC20 Contract', async () => {
//       await expect(exampleERC20.mint(addr1.address, changeToBigInt(amount)))
//         .to.emit(exampleERC20, 'Transfer')
//         .withArgs(ethers.constants.AddressZero, addr1.address, changeToBigInt(amount));
//       expect(await exampleERC20.totalSupply()).to.equal(changeToBigInt(amount));
//       expect(await exampleERC20.balanceOf(addr1.address)).to.equal(changeToBigInt(amount));
//     });
//   });

//   describe('Test Approval exampleERC20', () => {
//     it('should get approved for the Example ERC20 Contract', async () => {
//       await expect(exampleERC20.connect(addr1).approve(addr2.address, changeToBigInt(amount)))
//         .to.emit(exampleERC20, 'Approval')
//         .withArgs(addr1.address, addr2.address, changeToBigInt(amount));
//       expect(await exampleERC20.allowance(addr1.address, addr2.address)).to.equal(changeToBigInt(amount));
//     });
//   });

//   describe('Test TransferFrom ExampleERC20', () => {
//     it('Example ERC20 Contract should have erc20 token after TransferFrom', async () => {
//       await expect(exampleERC20.connect(addr2).transferFrom(addr1.address, owner.address, changeToBigInt(amount)))
//         .to.emit(exampleERC20, 'Transfer')
//         .withArgs(addr1.address, owner.address, changeToBigInt(amount));
//       expect(await exampleERC20.balanceOf(owner.address)).to.equal(changeToBigInt(amount));
//     });
//   });

//   describe('Test burn exampleERC20', () => {
//     it('Example ERC20 Contract should burn erc20 token clearly', async () => {
//       await expect(exampleERC20.connect(owner).burn(changeToBigInt(amount)))
//         .to.emit(exampleERC20, 'Transfer')
//         .withArgs(owner.address, ethers.constants.AddressZero, changeToBigInt(amount));
//       expect(await exampleERC20.balanceOf(owner.address)).to.equal(0);
//     });
//   });
// });

describe("MyERC20", () => {
    // contract(배포된 컨트랙트 객체를 저장할 변수)
    let exampleERC20: Contract;
    // signers(테스트에 참여할 지갑 계정)
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    // 전송할 토큰의 양
    let amount = 100;

    before(async () => {
        // ethers.getSigners()를 호출하여 Hardhat 로컬 노드가 제공하는 테스트 계정 배열을 받아와 각각 owner, addr1, addr2에 할당
        [owner, addr1, addr2] = await ethers.getSigners();
      });

    // 배포된 컨트랙트의 name(), symbol(), decimals() 함수를 호출하여 반환된 값이 위에서 설정한 상수(MyToken, MT, 18)와 일치하는지 검증
    describe("Test Example ERC20 Metadata", () => {
        it("Should get correct name, symbol, decimal for the Example ERC20 Contract", async () => {
            const ExampleERC20Factory = await ethers.getContractFactory("MyERC20");
            exampleERC20 = await ExampleERC20Factory.deploy();
            await exampleERC20.deployed();

            expect(await exampleERC20.name()).to.equal(name);
            expect(await exampleERC20.symbol()).to.equal(symbol);
            expect(await exampleERC20.decimals()).to.equal(decimals);
        });
    });

    // 토큰 발행(Mint) 기능을 테스트
    describe("Test Mint exampleERC20", () => {
        it("Should get correct MetaData for the Example ERC20 Contract", async () => {
            await expect(exampleERC20.mint(addr1.address, changeToBigInt(amount)))  // addr1에게 100 토큰을 발행
                .to.emit(exampleERC20, "Transfer")                                  // Transfer 이벤트가 발생함을 검증
                .withArgs(ethers.constants.AddressZero, addr1.address, changeToBigInt(amount)); // AddressZero에서 addr1으로 100만큼 전송된 것이 맞는지 확인
        
            // totalSupply(): 전체 발행량이 100개로 늘어났는지 확인
            expect(await exampleERC20.totalSupply()).to.equal(changeToBigInt(amount));
            // balanceOf(addr1): addr1의 잔액이 100개가 되었는지 확인
            expect(await exampleERC20.balanceOf(addr1.address)).to.equal(changeToBigInt(amount));
        });
    });

    describe("Test Approval exampleERC20", () => {
        it("should get approved for the Example ERC20 Contract", async () => {
            // 트랜잭션 호출 주체를 owner에서 addr1으로 변경 addr1이 addr2에게 100 토큰을 사용할 권한을 부여
            await expect(exampleERC20.connect(addr1).approve(addr2.address, changeToBigInt(amount)))    
                .to.emit(exampleERC20, "Approval")  // Approval 이벤트 발생함을 검증 
                .withArgs(addr1.address, addr2.address, changeToBigInt(amount)); // Approval 이벤트의 인자(주인, 대리인, 금액)를 검증

            // allowance 함수를 통해 addr1이 addr2에게 허락한 잔여 금액이 100인지 확인
            expect(await exampleERC20.allowance(addr1.address, addr2.address)).to.equal(changeToBigInt(amount));
        });
    });

    describe('Test TransferFrom ExampleERC20', () => {
        it('Example ERC20 Contract should have erc20 token after TransferFrom', async () => {
            await expect(exampleERC20.connect(addr2).transferFrom(addr1.address, owner.address, changeToBigInt(amount)))
                .to.emit(exampleERC20, "Transfer")
                .withArgs(addr1.address, owner.address, changeToBigInt(amount))
            
            expect(await exampleERC20.balanceOf(owner.address)).to.equal(changeToBigInt(amount));
            expect(await exampleERC20.balanceOf(addr1.address)).to.equal(0);
        });
    });

    describe('Test burn exampleERC20', () => {
        it('Example ERC20 Contract should burn erc20 token clearly', async () => {
            await expect(exampleERC20.burn(changeToBigInt(amount)))
                .to.emit(exampleERC20, "Transfer")
                // 이벤트 검증: 소각은 Transfer 이벤트가 발생하되, 받는 주소(to)가 0x00...00(AddressZero)인 것이 특징
                .withArgs(owner.address, ethers.constants.AddressZero, changeToBigInt(amount))

            // 소각 후 owner의 잔액이 0이 되었는지 최종 확인
            expect(await exampleERC20.balanceOf(owner.address)).to.equal(0);
        });
    });
});