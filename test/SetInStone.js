const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

describe("SetInStone contract", function() {
    async function deployTokenFixture() {
        const [signer1, signer2] = await ethers.getSigners()

        const SetInStoneFactory = await ethers.getContractFactory("SetInStone")
        const SetInStone = await SetInStoneFactory.deploy()
        await SetInStone.deployed()

        return { SetInStoneFactory, SetInStone, signer1, signer2 }
    }

    async function createPact(contract, description, taker) {
        await contract.createPact(description, taker)
    }

    it("Should create a new pact", async function() {
        const { SetInStone, signer2 } = await loadFixture(deployTokenFixture)

        createPact(SetInStone, "We hereby solemnly swear to...", signer2.address)
        const pactAddress = Array.from(await SetInStone.getPact(0))[2]
        expect(pactAddress).to.equal(signer2.address)
    })

    it("Should allow pacts to be confirmed", async function() {
        const { SetInStone, signer2 } = await loadFixture(deployTokenFixture)
        
        createPact(SetInStone, "We hereby solemnly swear to...", signer2.address)
        await SetInStone.connect(signer2).confirmPact(0)

        const status = Array.from(await SetInStone.getPact(0))[3]
        // enum values are returned as integers.
        expect(status).to.equal(1)
    })

    it("Should only allow the taker to confirm a pact", async function() {
        const { SetInStone, signer2 } = await loadFixture(deployTokenFixture)
        
        createPact(SetInStone, "We hereby solemnly swear to...", signer2.address)
        await expect(SetInStone.confirmPact(0)).to.be.reverted

        const status = Array.from(await SetInStone.getPact(0))[3]
        expect(status).to.equal(0)
    })
})