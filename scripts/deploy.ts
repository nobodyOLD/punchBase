import hre from "hardhat";

async function main() {
    const PunchBaseGame = await hre.ethers.getContractFactory("PunchBaseGame");
    const game = await PunchBaseGame.deploy();

    await game.waitForDeployment();

    console.log(`PunchBaseGame deployed to ${await game.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
