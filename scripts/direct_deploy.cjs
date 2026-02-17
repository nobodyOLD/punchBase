const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner();

    const artifact = JSON.parse(fs.readFileSync("./artifacts/contracts/PunchBaseGame.sol/PunchBaseGame.json", "utf8"));

    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    const game = await factory.deploy();

    await game.waitForDeployment();

    console.log(`PunchBaseGame deployed to ${await game.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
