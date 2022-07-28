// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SetInStone {
    enum Status { Pending, Confirmed, Rejected }

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
    error PactNotPending();

    event PactCreated(address indexed _initiator, address indexed _taker, string _description);
    event PactConfirmed(address indexed _initiator, address indexed _taker, uint id);
    event PactRejected(address indexed _initiator, address indexed _taker, uint id);

    modifier onlyTaker(uint index, address addr) {
        if (pacts[index].taker != addr) revert WrongAddress();
        _;
    }

    constructor() {
    }

    function createPact(string memory description, address taker) public {
        pacts.push(Pact(pacts.length + 1, description, msg.sender, taker, Status.Pending));
        
        if (!(taker == msg.sender)) {
            pactIndex[msg.sender].push(pacts.length - 1);
            pactIndex[taker].push(pacts.length - 1);
        } else {
            pactIndex[msg.sender].push(pacts.length - 1);
        }

        emit PactCreated(msg.sender, taker, description);
    }

    function confirmPact(uint index) public onlyTaker(index, msg.sender) {
        if (pacts[index].status == Status.Pending) {
            pacts[index].status = Status.Confirmed;
        } else {
            revert PactNotPending();
        }
            
        emit PactConfirmed(pacts[index].initiator, msg.sender, index);
    }

    function rejectPact(uint index) public onlyTaker(index, msg.sender) {
        if (pacts[index].status == Status.Pending) {
            pacts[index].status = Status.Rejected;
        } else {
            revert PactNotPending();
        }

        emit PactRejected(pacts[index].initiator, msg.sender, index);
    }

    function getPact(uint index) public view returns (Pact memory) {
        return pacts[index];
    }

    function getPactIdsByAddress(address addr) public view returns (uint[] memory) {
        return pactIndex[addr];
    }
}