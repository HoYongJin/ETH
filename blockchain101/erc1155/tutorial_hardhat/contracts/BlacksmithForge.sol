// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract BlacksmithForge is ERC1155, Ownable, ERC1155Burnable {
    // ID 정의 
    uint256 public constant GOLD = 0;
    uint256 public constant IRON = 1;
    uint256 public constant WOOD = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    // 아이템 가격
    mapping(uint256 => uint256) public itemPrices;

    constructor() ERC1155("https://game.api/api/item/{id}.json") {
        // 초기 가격 설정
        itemPrices[IRON] = 10;
        itemPrices[WOOD] = 5;

        // 초기 재료 발행
        _mint(msg.sender, GOLD, 10**10, "");
        _mint(msg.sender, IRON, 1000, "");
        _mint(msg.sender, WOOD, 1000, "");
    }

    // 기능 구현

    // 재료 구매
    function buyMaterial(uint256 itemId, uint256 amount) external {
        require(itemId == WOOD || itemId == IRON, "Invalid material");

        uint256 cost = itemPrices[itemId] * amount;
        require(balanceOf(msg.sender, GOLD) >= cost, "Not enough Gold");

        // 유저의 GOLD 소각
        _burn(msg.sender, GOLD, cost);

        // 재료 발행
        _mint(msg.sender, itemId, amount, "");
    }

    // SWORD 제작(IRON 3개 + WOOD 2개)
    function craftSword() external {
        // 재료 확인 및 소각(Batch Burn)
        uint256[] memory materialIds = new uint256[](2);
        materialIds[0] = IRON;
        materialIds[1] = WOOD;

        uint256[] memory materialAmounts = new uint256[](2);
        materialAmounts[0] = 3;
        materialAmounts[1] = 2;
        
        _burnBatch(msg.sender, materialIds, materialAmounts);

        _mint(msg.sender, SWORD, 1, "");
    }

    // 선물 주기(GOLD 100, IRON 5, WOOD 5)
    function airdropStarterPack(address _addr) external onlyOwner {
        uint256[] memory materialIds = new uint256[](3);
        materialIds[0] = GOLD;
        materialIds[1] = IRON;
        materialIds[2] = WOOD;

        uint256[] memory materialAmounts = new uint256[](2);
        materialAmounts[0] = 100;
        materialAmounts[1] = 5;
        materialAmounts[2] = 5;

        _burnBatch(msg.sender, materialIds, materialAmounts);
        _mintBatch(_addr, materialIds, materialAmounts, "");
    }
}