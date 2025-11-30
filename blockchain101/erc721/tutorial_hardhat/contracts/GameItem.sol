// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";  // NFT 표준 기능 + 메타데이터 URI(이미지 주소)를 관리하는 확장 기능
import "@openzeppelin/contracts/access/Ownable.sol";    // 컨트랙트의 '주인(Owner)'을 설정하고, 주인만 실행할 수 있는 기능(onlyOwner)을 제공
import "@openzeppelin/contracts/utils/Counters.sol";    // 1, 2, 3... 순서대로 증가하는 안전한 카운터를 제공합니다. (tokenId 생성용)

// GameItem이라는 컨트랙트를 정의하며 ERC721URIStorage와 Ownable의 모든 기능을 상속
contract GameItem is ERC721URIStorage, Ownable {
    // Counters라는 라이브러리에 있는 모든 함수들을, Counters.Counter라는 데이터 타입(구조체)에 갖다 붙임
    // Counters.Counter 타입의 변수에서 점(.)을 찍고 라이브러리 함수를 바로 호출 가능
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;     // Counters.Counter: 변수의 타입

    // NFT별 고유 능력치 (On-chain Data)
    struct SwordStats {
        string name;
        uint256 level;
        uint256 attackPower;
    }
    mapping(uint256 => SwordStats) public swordStats;   // tokenId를 넣으면 그에 해당하는 SwordStats가 튀어나오는 매핑 구조

    // 아이템이 강화되었을 때 블록체인 밖(프론트엔드/게임 클라이언트)으로 알림을 보내기 위한 이벤트를 정의
    event WeaponUpgraded(uint256 indexed tokenId, uint256 newLevel, uint256 newAttackPower);

    // ERC721의 생성자를 호출하여, 이 NFT 컬렉션의 이름을 "LegendarySword", 심볼을 "SWORD"로 설정
    constructor() ERC721("LegendarySword", "SWORD") {}

    function forgeSword(
        address player, 
        string memory tokenURI, 
        string memory _name, 
        uint256 _baseAttack
    ) public onlyOwner returns(uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(player, newItemId);               // NFT 발행 로직
        _setTokenURI(newItemId, tokenURI);      // 보여지는 데이터(Off-chain) 설정(newItemId번 토큰의 이미지는 tokenURI에 있다)

        swordStats[newItemId] = SwordStats({    // 게임 데이터(On-chain) 설정(mapping에 SWORD 정보 저장)
            name: _name,
            level: 1,
            attackPower: _baseAttack
        });

        return newItemId;
    }

    function levelUp(
        uint256 tokenId
    ) public {
        require(_exists(tokenId), "Sword does not exist");
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");

        SwordStats storage p = swordStats[tokenId];     // swordStats 매핑에서 해당 토큰의 데이터를 가져오는데, storage 포인터를 사용

        require(p.level < 10, "Max level reached");

        p.level++;
        p.attackPower += 10;

        emit WeaponUpgraded(tokenId, p.level, p.attackPower);
    }

    function canDefeatMonster(
        uint256 tokenId, 
        uint256 monsterHp
    ) public view returns(bool) {
        require(_exists(tokenId), "Sword does not exist");

        return (swordStats[tokenId].attackPower > monsterHp);
    }
}