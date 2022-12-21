// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;




contract Counter{
    uint public num = 0;
    event Change(uint indexed _number);
    function increase() external{
        num += 1;
        emit Change(num);
    }
    
    function decrease() external{
        num -= 1;
        emit Change(num);
        
    }


}
