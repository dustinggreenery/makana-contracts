const { ethers } = require("hardhat");

// Choose which account, use 0 to give all accounts a vote.
const ACCOUNT = 0;

async function giveVotePower() {
    const event = await ethers.getContract("Event");
    const ballotAddress = await event.getGovernanceToken();
    const ballot = await ethers.getContractAt("Ballot", ballotAddress);

    [, , firstvoter, secondvoter, thirdvoter] = await ethers.getSigners();
    let gainer;

    if (ACCOUNT == 0) {
        const tx = await ballot.connect(firstvoter).mintNFT();
        await tx.wait(1);

        console.log(`Minted Ballot for ${firstvoter.address}.`);

        const tx2 = await ballot.connect(firstvoter).delegate(firstvoter.address);
        await tx2.wait(1);

        console.log(`Checkpoints: ${await ballot.numCheckpoints(firstvoter.address)}`);
        console.log(`Votes: ${await ballot.getVotes(firstvoter.address)}\n`);

        const tx3 = await ballot.connect(secondvoter).mintNFT();
        await tx3.wait(1);

        console.log(`Minted Ballot for ${secondvoter.address}.`);

        const tx4 = await ballot.connect(secondvoter).delegate(secondvoter.address);
        await tx4.wait(1);

        console.log(`Checkpoints: ${await ballot.numCheckpoints(secondvoter.address)}`);
        console.log(`Votes: ${await ballot.getVotes(secondvoter.address)}\n`);

        const tx5 = await ballot.connect(thirdvoter).mintNFT();
        await tx5.wait(1);

        console.log(`Minted Ballot for ${thirdvoter.address}.`);

        const tx6 = await ballot.connect(thirdvoter).delegate(thirdvoter.address);
        await tx6.wait(1);

        console.log(`Checkpoints: ${await ballot.numCheckpoints(thirdvoter.address)}`);
        console.log(`Votes: ${await ballot.getVotes(thirdvoter.address)}`);
        return;
    } else if (ACCOUNT == 1) {
        gainer = firstvoter;
    } else if (ACCOUNT == 2) {
        gainer = secondvoter;
    } else if (ACCOUNT == 3) {
        gainer = thirdvoter;
    }

    const tx = await ballot.connect(gainer).mintNFT();
    await tx.wait(1);

    console.log(`Minted Ballot for ${gainer.address}.`);

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
