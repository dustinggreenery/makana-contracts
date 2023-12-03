const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");
const { developmentChains, TIME_TILL_START } = require("../helper-hardhat-config");

// 3 don't work for some reason
// Account 1, 2 or 3
const ACCOUNT_TO_VOTE = 2;
const SUPPORT = false;

async function vote() {
    [, sponsor, firstvoter, secondvoter, thirdvoter] = await ethers.getSigners();
    let voter;

    if (ACCOUNT_TO_VOTE == 1) {
        voter = firstvoter;
    } else if (ACCOUNT_TO_VOTE == 2) {
        voter = secondvoter;
    } else if (ACCOUNT_TO_VOTE == 3) {
        voter = thirdvoter;
    }
    console.log(`Voting with ${voter.address}`);

    const event = await ethers.getContract("Event");
    const ballotBoxAddress = await event.getBallotBox(sponsor);
    const ballotBox = await ethers.getContractAt("BallotBox", ballotBoxAddress);
    let state = await ballotBox.getState();

    if (state == 0 && developmentChains.includes(network.name)) {
        await moveBlocks(TIME_TILL_START + 1);
        const tx0 = await ballotBox.performUpkeep("0x00");
        await tx0.wait(1);
    }
    // Since Chainlink Automation doesn't support zkEVM.
    if (state == 0 && network.name == "zkEVM") {
        const tx0 = await ballotBox.performUpkeep("0x00");
        await tx0.wait(1);
    }

    state = await ballotBox.getState();
    if (state == 1) {
        const tx = await ballotBox.connect(voter).vote(SUPPORT);
        await tx.wait(1);

        console.log("Voted!");
    } else {
        console.log("Not in Voting State.");
    }
}

vote()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
