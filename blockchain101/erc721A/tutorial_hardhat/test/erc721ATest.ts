/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

const name = 'Myerc721A';
const symbol = '721A';
const price = 0.001;
// const tokenURI = 'https://raw.githubusercontent.com/hyunkicho/blockchain101/main/ERC721A/metadata/';

describe('Start Example ERC721A test', async () => {
    // contract(배포된 컨트랙트 객체를 저장할 변수)
    let exampleERC721A: Contract;
    // signers(테스트에 참여할 지갑 계정)
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    before(async () => {
        // ethers.getSigners()를 호출하여 Hardhat 로컬 노드가 제공하는 테스트 계정 배열을 받아와 각각 owner, addr1, addr2에 할당
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe('Test Example ERC721A Metadata', () => {
        it('Should get correct name, symbol, decimal for the Example ERC721A Contract', async () => {
            const ExampleERC721AFactory = await ethers.getContractFactory('MyERC721A');
            exampleERC721A = await ExampleERC721AFactory.deploy();
            await exampleERC721A.deployed();

            expect(await exampleERC721A.name()).to.equal(name);
            expect(await exampleERC721A.symbol()).to.equal(symbol);
        });
    });

    describe('Test Mint exampleERC721A',  () => {
        it('Should  Mint corrrectly for the Example ERC721A Contract', async () => {
            await exampleERC721A.connect(addr1).mint(2, {value: ethers.utils.parseEther((price*2).toString())});

            await expect(exampleERC721A.connect(addr1).mint(2, {value: ethers.utils.parseEther('1')}))
                .to.be.revertedWith('MyERC721A : msg.value is not correct');

            expect(await exampleERC721A.totalSupply()).to.equal('2');   
            expect(await exampleERC721A.balanceOf(addr1.address)).to.equal('2');
        });
    });

    describe('Test Approval exampleERC721A',  () => {
        it('should get approved for the Example ERC721A Contract', async () => {
            await expect(exampleERC721A.connect(addr1).approve(addr2.address, '1'))
                .to.emit(exampleERC721A, 'Approval')
                .withArgs(addr1.address, addr2.address, '1');

            expect(await exampleERC721A.getApproved('1')).to.equal(addr2.address);
        });
    });

    describe('Test TransferFrom ExampleERC721A', () => {
        it('Example ERC721A Contract should have ERC721A token after TransferFrom', async () => {
            await expect(exampleERC721A.connect(addr2).transferFrom(addr1.address, owner.address, '1'))
                .to.emit(exampleERC721A, 'Transfer')
                .withArgs(addr1.address, owner.address, '1');

            expect(await exampleERC721A.ownerOf('1')).to.equal(owner.address);
        });
    });
});