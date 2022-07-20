// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SetInStone {
    enum Status { Pending, Confirmed }

    struct Pact {
        uint id;
        string description;
        address initiator;
        address taker;
        Status status;
    }

    Pact[] pacts;

    mapping(address => uint[]) public pactIndex;

    error WrongAddress();

    modifier onlyTaker(uint index, address addr) {
        if (pacts[index].taker != addr) revert WrongAddress();
        _;
    }

    constructor() {
    }

    function createPact(string memory description, address taker) public {
        pacts.push(Pact(pacts.length + 1, description, msg.sender, taker, Status.Pending));
        
        pactIndex[msg.sender].push(pacts.length - 1);
        pactIndex[taker].push(pacts.length - 1);
    }

    function confirmPact(uint index) public onlyTaker(index, msg.sender) {
        pacts[index].status = Status.Confirmed;
    }

    function getPact(uint index) public view returns (Pact memory) {
        return pacts[index];
    }

    function getPactsByAddress(address addr) public view returns (uint[] memory) {
        return pactIndex[addr];
    }
}