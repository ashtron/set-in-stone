// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path")

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    )
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners()
  console.log(
    "Deploying contracts with account",
    await deployer.getAddress()
  )

  const SetInStone = await ethers.getContractFactory("SetInStone")
  const setInStone = await SetInStone.deploy()
  await setInStone.deployed()

  console.log("SetInStone address:", setInStone.address)

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(setInStone)
}

function saveFrontendFiles(setInStone) {
  const fs = require("fs")
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts")

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ SetInStone: setInStone.address }, undefined, 2)
  )

  const SetInStoneArtifact = artifacts.readArtifactSync("SetInStone")

  fs.writeFileSync(
    path.join(contractsDir, "SetInStone.json"),
    JSON.stringify(SetInStoneArtifact, null, 2)
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
