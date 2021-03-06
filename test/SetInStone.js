const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

describe("SetInStone contract", function() {
    async function deployTokenFixture() {
        const [signer1, signer2] = await ethers.getSigners()

        const SetInStoneFactory = await ethers.getContractFactory("SetInStone")
        const SetInStone = await SetInStoneFactory.deploy()
        await SetInStone.deployed()

        const description = "We hereby solemnly swear to..."

        return { SetInStone, signer1, signer2, description }
    }

    it("Should create a new pact", async function() {
        const { SetInStone, signer2, description } = await loadFixture(deployTokenFixture)

        await SetInStone.createPact(description, signer2.address)
        const pactAddress = Array.from(await SetInStone.getPact(0))[3]
        expect(pactAddress).to.equal(signer2.address)
    })

    it("Should allow pacts to be confirmed", async function() {
        const { SetInStone, signer2, description } = await loadFixture(deployTokenFixture)
        
        await SetInStone.createPact(description, signer2.address)
        await SetInStone.connect(signer2).confirmPact(0)

        const status = Array.from(await SetInStone.getPact(0))[4]
        // enum values are returned as integers.
        expect(status).to.equal(1)
    })

    it("Should allow pacts to be rejected", async function() {
        const { SetInStone, signer2, description } = await loadFixture(deployTokenFixture)
        
        await SetInStone.createPact(description, signer2.address)
        await SetInStone.connect(signer2).rejectPact(0)

        const status = Array.from(await SetInStone.getPact(0))[4]
        expect(status).to.equal(2)
    })

    it("Should only allow the taker to confirm a pact", async function() {
        const { SetInStone, signer2, description } = await loadFixture(deployTokenFixture)
        
        await SetInStone.createPact(description, signer2.address)
        await expect(SetInStone.confirmPact(0)).to.be.reverted

        const status = Array.from(await SetInStone.getPact(0))[4]
        expect(status).to.equal(0)
    })

    it("Should only allow pending pacts to be confirmed or rejected", async function() {
        const { SetInStone, signer2, description } = await loadFixture(deployTokenFixture)
        
        await SetInStone.createPact(description, signer2.address)
        await SetInStone.connect(signer2).confirmPact(0)
        await SetInStone.createPact(description, signer2.address)
        await SetInStone.connect(signer2).rejectPact(1)

        await expect(SetInStone.connect(signer2).confirmPact(0)).to.be.reverted
        await expect(SetInStone.connect(signer2).rejectPact(1)).to.be.reverted
    })

    it("Should retrieve pacts by address", async function() {
        const { SetInStone, signer1, signer2, description } = await loadFixture(deployTokenFixture)

        await SetInStone.createPact(description, signer2.address)
        await SetInStone.connect(signer2).createPact(description, signer1.address)
        await SetInStone.createPact(description, signer2.address)

        const bigNumberPactIds = await SetInStone.getPactIdsByAddress(signer1.address)
        const pactIds = bigNumberPactIds.map(pactId => { return pactId.toNumber() })

        expect(pactIds[0]).to.equal(0)
        expect(pactIds[1]).to.equal(1)
        expect(pactIds[2]).to.equal(2)
    })

    it("Should emit events", async function() {
        const { SetInStone, signer1, signer2, description } = await loadFixture(deployTokenFixture)

        await expect(SetInStone.createPact(description, signer2.address))
            .to.emit(SetInStone, "PactCreated")
            .withArgs(signer1.address, signer2.address, description)

        await expect(await SetInStone.connect(signer2).confirmPact(0))
            .to.emit(SetInStone, "PactConfirmed")
            .withArgs(signer1.address, signer2.address, 0)

        await SetInStone.createPact(description, signer2.address)

        await expect(await SetInStone.connect(signer2).rejectPact(1))
            .to.emit(SetInStone, "PactRejected")
            .withArgs(signer1.address, signer2.address, 1)
    })
    
    it("Should only add one pact when initiator and taker are the same", async function() {
        const { SetInStone, signer1, signer2, description } = await loadFixture(deployTokenFixture)

        await SetInStone.createPact(description, signer1.address)

        await expect((await SetInStone.getPactIdsByAddress(signer1.address)).length).to.equal(1)
    })
})