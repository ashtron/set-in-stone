// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SetInStone {
    enum Status { Pending, Confirmed }

    struct Pact {
        string description;
        address initiator;
        address taker;
        Status status;
    }

    Pact[] pacts;

    error WrongAddress();

    modifier onlyTaker(uint index, address addr) {
        if (pacts[index].taker != addr) revert WrongAddress();
        _;
    }

    constructor() {
    }

    function createPact(string memory description, address taker) public {
        pacts.push(Pact(description, msg.sender, taker, Status.Pending));
    }

    function confirmPact(uint index) public onlyTaker(index, msg.sender) {
        pacts[index].status = Status.Confirmed;
    }

    function getPact(uint index) public view returns (Pact memory) {
        return pacts[index];
    }
}