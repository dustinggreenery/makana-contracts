const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");
const { developmentChains, TIME_TILL_START } = require("../helper-hardhat-config");

// 0 is first account, 1 is second account
const ACCOUNT_TO_VOTE = 1;
const SUPPORT = true;

async function vote() {
    [deployer, secondaryVoter] = await ethers.getSigners();
    let voter;

    if (ACCOUNT_TO_VOTE == 0) {
        voter = deployer;
    } else if (ACCOUNT_TO_VOTE == 1) {
        voter = secondaryVoter;
    }
    console.log(`Voting with ${voter.address}`);

    const ballotBox = await ethers.getContract("BallotBox");
    let state = await ballotBox.getState();

    if (state == 0 && developmentChains.includes(network.name)) {
        await moveBlocks(TIME_TILL_START + 1);
        const tx0 = await ballotBox.performUpkeep("0x00");
        await tx0.wait(1);
    }

    state = await ballotBox.getState();
    if (state == 1) {
        const tx = await ballotBox.connect(voter).vote(SUPPORT);
        tx.wait(1);

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
