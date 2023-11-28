const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");
const { developmentChains, TIME_TO_VOTE } = require("../helper-hardhat-config");

async function endVote() {
    const ballotBox = await ethers.getContract("BallotBox");
    let state = await ballotBox.getState();

    if (state == 0) {
        console.log("Voting hasn't Started.");
    } else if (state == 1) {
        if (developmentChains.includes(network.name)) {
            await moveBlocks(TIME_TO_VOTE + 1);
            const tx = await ballotBox.performUpkeep("0x00");
            await tx.wait(1);

            console.log("Voting Period Ended!");
        }
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
