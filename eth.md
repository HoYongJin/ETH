# Test Code Coverage
- 작성한 단위 테스트(Unit Test)가 스마트 컨트랙트의 실제 코드를 얼마나(몇 %) 실행하고 검증했는지를 시각적으로 보여주는 도구
- 테스트가 누락된 로직이나 조건문이 없는지 파악할 수 있음
- Stmts(Statements, 구문 커버리지)
    - 명령어(구문) 하나하나가 실행되었는가?
    - 구문 커버리지는 줄 수와 상관없이 실행 가능한 최소 단위의 명령이 실행되었는지 확인
- Branch(Branch, 분기 커버리지)
    - 코드의 갈림길(참/거짓)을 모두 가보았는가?
    - 모든 경우를 테스트 하기는 사실상 불가능
- Funcs(Functions, 함수 커버리지)
    - 컨트랙트 안의 함수들을 최소 한 번이라도 호출했는가?
- Lines(Lines, 라인 커버리지)
    - 코드 파일의 줄(Line) 중에서 실행된 줄의 비율은?
    - 우리가 눈으로 보는 코드의 행 번호를 기준
- Uncovered Lines(미커버 라인)
    - 테스트가 닿지 않은 코드의 줄 번호
    - 어디를 추가로 테스트해야 하는지 알려주는 수단

# hardhat-gas-reporter
- 가스비 계산을 자동으로 수행해주는 모듈
- 단위 테스트별 가스 사용량 측정: 각 테스트 케이스가 실행될 때 소모되는 가스량을 측정
- 메소드 및 배포 지표 제공: 스마트 컨트랙트의 함수(Method) 호출과 컨트랙트 배포(Deployment) 시 발생하는 가스 비용을 측정
- 법정 화폐 비용 환산: 가스 비용을 ETH 단위뿐만 아니라 KRW(원화), USD(달러) 등 실제 국가 통화 비용으로 환산하여 제공

# sol2uml
- 스마트 컨트랙트 코드를 분석하여 자동으로 UML(Unified Modeling Language) 다이어그램을 생성해 주는 도구
- 컨트랙트 구조 시각화
- 상태 변수(State Variables) 표시
- 함수(Functions) 및 이벤트(Events) 표시
- 복잡한 스마트 컨트랙트 코드를 읽기 쉬운 다이어그램으로 변환하여, 컨트랙트의 구조와 구성 요소(변수, 함수, 이벤트)를 한눈에 파악할 수 있도록 도와주는 시각화 도구

# Token
- 이더리움 생태계에서 토큰은 스마트 컨트랙트로 구현된 디지털 자산
- 이더리움 내에서 사실상 거의 모든 것(virtually anything)을 나타낼 수 있음  
    - Reputation points
    - Skills of a character
    - Lottery tickets
    - Financial assets
    - Fiat currency
    - Gold

# ERC20(Ethereum Request for Comments 20)
- 이더리움 상에서 대체 가능한 토큰(Fungible Token)을 만들기 위한 기술적 표준(Standard)
- 모든 토큰이 유형과 가치 면에서 완전히 동일
- ERC20 토큰 1개는 다른 ERC20 토큰 1개와 언제나 동일
- 현재 대부분의 프로젝트는 이 표준을 따르며, 특히 OpenZeppelin에서 구현한 ERC20 표준이 가장 유명하고 널리 사용
- View Functions
    - name(): 토큰의 이름을 반환
    - symbol(): 토큰의 심볼을 반환
    - decimals(): 토큰의 소수점 단위를 반환
    - totalSupply(): 전체 발행량을 반환
    - balanceOf(address _owner): 특정 주소(_owner)가 보유한 토큰 잔액을 반환
    - allowance(address _owner, address _spender): 오너가 스펜더에게 사용을 허락한 잔여 토큰 양을 반환
- State-Changing Functions
    - transfer(address _to, uint256 _value): 호출자가 _to 주소로 _value만큼의 토큰을 전송
    - approve(address _spender, uint256 _value): 내 토큰 중 _value만큼을 _spender가 대신 사용할 수 있도록 승인
    - transferFrom(address _from, address _to, uint256 _value): 승인된 토큰을 _from에서 _to로 전송(주로 제3자가 대리 전송할 때 사용)
- Events
    - event Transfer(address indexed _from, address indexed _to, uint256 _value): 토큰이 전송될 때 발생
    - event Approval(address indexed _owner, address indexed _spender, uint256 _value): approve 함수를 통해 토큰 사용 승인이 일어날 때 발생

# ERC20 Extension
- ERC20 표준은 아니지만, 개발자들이 자주 필요로 하여 추가적으로 구현하여 사용하는 함수 및 모듈
- OpenZeppelin Contracts 라이브러리를 설치하여 상속받아 사용하는 것이 일반적이고 안전
- 주요 ERC20 Extensions
    1. ERC20Burnable(Burnable - 소각)
        - 토큰을 영구적으로 삭제(소각)하여 총 발행량(Total Supply)을 줄이는 기능
        - ERC20 표준에는 _burn이라는 내부(internal) 함수만 존재
        - ERC20Burnable 확장을 사용하면 외부에서 호출 가능한 public 함수인 burn(amount)을 제공받아, 토큰 소유자가 자신의 토큰을 소각 가능
    2. ERC20Capped(Capped - 발행량 제한)
        - 토큰의 최대 발행량(Max Supply)을 제한하는 기능
        - ERC20Capped 확장은 생성자에서 cap(최대 발행량)을 설정
        - cap 값은 불변(immutable)으로 설정되어 배포 후 변경 불가
        - 토큰을 추가 발행(mint)할 때 현재 총 발행량이 이 cap을 초과하지 않는지 검사
        - 무제한 발행으로 인한 가치 희석을 방지하기 위한 보안 감사(Audit)
    3. ERC20Pausable(Pausable - 일시정지)
        - 비상 상황 발생 시 토큰의 모든 전송(transfer, transferFrom, mint, burn)을 일시적으로 중단시키는 기능
        - _beforeTokenTransfer 훅(Hook)을 오버라이딩하여, 컨트랙트가 paused 상태일 때는 토큰 전송을 거부(revert)
        - 해킹이나 치명적인 버그 발견 시 피해 확산을 막기 위한 안전장치(Circuit Breaker)
        - 관리자가 마음대로 정지시킬 수 있다는 점에서 중앙화(Centralization) 이슈

# ERC721
- 이더리움 블록체인 상에서 대체 불가능한 토큰(Non-Fungible Token, NFT)을 구현하기 위한 표준
- Non-Fungibility
    - 개별 토큰마다 고유한 가치를 지님
    - 같은 스마트 컨트랙트에서 발행된 토큰이라도 나이(age), 희귀도(rarity), 또는 시각적 요소(visual) 등에 따라 서로 다른 가치를 지님
- TokenID(uint256)
    - 유일성 보장: (컨트랙트 주소, tokenId)의 쌍은 전역적으로 유일(globally unique)
    - tokenId를 입력값으로 사용하여 이미지나 정보를 시각적으로 표현(output)
- View Functions
    - balanceOf(address _owner): 특정 주소(_owner)가 보유한 NFT의 개수를 반환
    - ownerOf(uint256 _tokenId): 특정 _tokenId를 가진 NFT의 소유자 주소를 반환
    - getApproved(uint256 _tokenId): 특정 _tokenId에 대해 전송 권한을 승인받은 대리인(주소)을 반환
    - isApprovedForAll(address _owner, address _operator): _operator가 _owner의 모든 자산에 대해 관리 권한을 가지고 있는지 여부(bool)를 반환
- State-Changing Functions
    - safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data): 안전하게 소유권을 이전(수신자가 ERC721을 받을 수 있는지 확인하는 로직이 포함)
    - safeTransferFrom(address _from, address _to, uint256 _tokenId): 위 함수와 동일하지만 추가 데이터(data) 없이 전송
    - transferFrom(address _from, address _to, uint256 _tokenId): _from에서 _to로 해당 _tokenId의 소유권을 이전
    - approve(address _approved, uint256 _tokenId): 특정 _tokenId 하나에 대해 _approved 주소에게 전송 권한을 부여
    - setApprovalForAll(address _operator, bool _approved): 자신의 모든 NFT에 대한 관리 권한을 _operator에게 부여하거나 해제(true/false)
- Standard Events
    - event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId): NFT의 소유권이 변경될 때(전송될 때) 발생
    - event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId): 특정 NFT(_tokenId)에 대한 승인 내용이 변경될 때 발생
    - event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved): setApprovalForAll 함수를 통해 모든 자산에 대한 관리 권한 설정이 변경될 때 발생