const { ethers } = require("hardhat");

// 0 is first account, 1 is second account
const ACCOUNT = 1;
const AMOUNT = ethers.parseEther("5");

async function giveVotePower() {
    const ballot = await ethers.getContract("Ballot");
    [deployer, secondaryVoter] = await ethers.getSigners();
    let gainer;

    if (ACCOUNT == 0) {
        gainer = deployer;
    } else if (ACCOUNT == 1) {
        gainer = secondaryVoter;
    }

    const tx = await ballot.connect(gainer).mint(AMOUNT);
    await tx.wait(1);

    console.log(`Minted Tokens for ${gainer.address}.`);

    const tx2 = await ballot.connect(gainer).delegate(gainer.address);
    await tx2.wait(1);

    console.log(`Checkpoints: ${await ballot.numCheckpoints(gainer.address)}`);
    console.log(`Votes: ${await ballot.getVotes(gainer.address)}`);
}

giveVotePower()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
