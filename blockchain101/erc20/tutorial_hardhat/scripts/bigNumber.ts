import { ethers } from 'hardhat';

// 자바스크립트의 number 타입은 2^53-1(약 9 * 10^15)까지만 안전하게 표현
// WEI 단위는 이 범위를 초과하므로, 자바스크립트는 이를 근사치로 처리하거나 출력 시 과학적 표기법(Scientific Notation)을 사용
const decimal = 10**18; // 이더리움의 표준 단위인 18자리 소수점(WEI 단위)을 표현
const exampleNumber = 100000 * decimal;     // 10^{23}: 1e+23과 같은 지수 형태(부동소수점)로 관리 --> ethers.BigNumber에 바로 넣을 수 없음
const exampleNumber2 = 1000000000000 * decimal;

// "1e+23" 같은 문자열을 "100000..." 같은 평문 숫자 문자열로 변환
function noExponents(_number: number){
    var data = String(_number).split(/[eE]/);    // 입력받은 숫자 _number를 문자열로 변환한 뒤, 지수 표기인 e 또는 E를 기준으로 분리
    if(data.length == 1) 
        return data[0];

    var  z= '', 
    sign = _number<0? '-':'',       // sign: 음수인지 확인
    str = data[0].replace('.', ''), // str: 가수부(앞부분 숫자)에서 소수점을 제거
    mag = Number(data[1])+ 1;       // mag: 지수부(뒷부분 숫자)를 숫자로 변환하고 보정(실제 자릿수 계산)

    // 지수가 음수일 때
    if(mag<0){
        z= sign + '0.';                     // 1. 시작 모양 만들기("0." or "-0.")
        while(mag++) z += '0';              // 2. 필요한 만큼 0 채우기
        return z + str.replace(/^\-/,'');   // 3. 0 이어 붙이기("0." --> "0.0" --> "0.00" ,,,)
    }
    // // 지수가 양수일 때
    mag -= str.length;      // 1. 필요한 0의 개수 계산
    while(mag--) z += '0';  // 2. 개수만큼 0을 붙임
    return str + z;         // 3. 원래 숫자 뒤에 0을 붙여서 반환
}

// 자바스크립트 기본 number 타입 상태인 exampleNumber를 출력
function getBigNumberEx() {
    console.log("exampleNumber with Exponents >>", exampleNumber)

    // noExponents(exampleNumber): 지수 표기된 숫자를 "1000..." 형태의 문자열로 변환
    // ethers.BigNumber.from(...): 문자열을 받아 Ethers.js의 BigNumber 객체로 변환
    // .toString(): BigNumber 객체를 다시 문자열로 변환하여 변수에 저장
    const noExponentsExample = ethers.BigNumber.from(noExponents(exampleNumber)).toString()
    console.log("exampleNumber toString : ",noExponentsExample);
    const noExponentsExample2 = ethers.BigNumber.from(noExponents(exampleNumber2)).toString()
    console.log("noExponentsExample2 toString : ",noExponentsExample2);

    // 문자열로 저장해둔 두 값을 다시 BigNumber 객체로 변환
    // .add() 메서드를 사용하여 오버플로우 없는 안전한 덧셈을 수행
    // 결과는 addResult라는 BigNumber 객체
    const addResult = ethers.BigNumber.from(noExponentsExample).add(ethers.BigNumber.from(noExponentsExample2));
    console.log("addResult : ",addResult);
    const addDecimal = ethers.utils.parseUnits(addResult.toString(), 18);
    console.log("addDecimal >>", addDecimal);
}

getBigNumberEx()