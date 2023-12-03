const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");
const { developmentChains, TIME_TO_VOTE } = require("../helper-hardhat-config");

async function endVote() {
    [, sponsor] = await ethers.getSigners();
    const event = await ethers.getContract("Event");
    const ballotBoxAddress = await event.getBallotBox(sponsor);
    const ballotBox = await ethers.getContractAt("BallotBox", ballotBoxAddress);
    let state = await ballotBox.getState();

    if (state == 0) {
        console.log("Voting hasn't Started.");
    } else if (state == 1) {
        if (developmentChains.includes(network.name)) {
            await moveBlocks(TIME_TO_VOTE + 1);
            const tx = await ballotBox.performUpkeep("0x00");
            await tx.wait(1);
        }
        // Since Chainlink Automation doesn't support zkEVM.
        if (network.name == "zkEVM") {
            const tx = await ballotBox.performUpkeep("0x00");
            await tx.wait(1);
        }

        console.log("Voting Period Ended!");
    } else {
        console.log("Voting Already Ended!");
    }
}

endVote()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
