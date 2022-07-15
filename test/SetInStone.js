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

    it("Should create a new pact", async function() {
        const { SetInStone, signer2 } = await loadFixture(deployTokenFixture)

        const description = "We hereby solemnly swear to..."
        const taker = signer2.address

        await SetInStone.createPact(description, taker)

        const pactAddress = Array.from(await SetInStone.getPact(0))[2]

        expect(pactAddress).to.equal(signer2.address)
    })

    // it("Should allow pacts to be confirmed", async function() {
    //     const { SetInStone, signer1, signer2 } = await loadFixture(deployTokenFixture)
    //     console.log(await SetInStone.getPact("0"))

    //     // await SetInStone.connect(signer2).confirmPact(0)

    //     // console.log(console.log(await SetInStone.getPact(0)))
    // })

    // it("Should only allow the taker to confirm a pact", async function() {
    // })
})