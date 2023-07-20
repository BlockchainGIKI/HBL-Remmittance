// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

contract BankOwner {

    address private bankOwner;
    event BankOwnerSet(address indexed oldOwner, address indexed newOwner);

    modifier isBankOwner() {
        require(msg.sender == bankOwner, "Caller is not bankOwner");
        _;
    }
    
    constructor() {
        bankOwner = msg.sender;
        emit BankOwnerSet(address(0), bankOwner);
    }

    function changeOwner(address newOwner) public isBankOwner {
        emit BankOwnerSet(bankOwner, newOwner);
        bankOwner = newOwner;
    }

    function getBankOwner() public view returns (address) {
        return bankOwner;
    }
}